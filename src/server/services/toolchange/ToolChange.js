import clientIO from 'socket.io-client';
import _find from 'lodash/find';
import settings from '../../config/settings';
import logger from '../../lib/logger';
import config from '../configstore';


const log = logger('service:toolchange');

class ToolChange {
    io = null;

    currentToolInSpindle = null;

    currentState = null;

    controller = null;

    state = {
        connected: false,
        release: false,
        blowout: false,
        toolholders: [
            {
                title: 'T1',
                state: false
            },
            {
                title: 'T2',
                state: false
            },
            {
                title: 'T3',
                state: false
            },
            {
                title: 'T4',
                state: false
            },
            {
                title: 'T5',
                state: false
            },
            {
                title: 'T6',
                state: false
            },
            {
                title: 'T7',
                state: false
            },
            {
                title: 'T8',
                state: false
            }
        ]
    }

    init(controller) {
        this.controller = controller;
        const self = this;
        if (settings.backend.toolChangeWS) {
            if (!this.io || !this.io.connected) {
                this.io = clientIO(settings.backend.toolChangeWS);
                log.debug('Connecting to tool change service: ' + settings.backend.toolChangeWS);

                this.io.on('connect', () => {
                    log.debug('Connected to tool change service');
                });

                this.io.on('connect_error', (error) => {
                    /** This will continue to retry on time out. Bring the service up to stop this error */
                    if (error !== 'timeout') {
                        log.error(error);
                    }
                });
                this.io.on('error', (error) => {
                    log.error(error);
                });

                this.io.on('toolchange:status', (data) => {
                    self.currentState = data;
                    self.setToolChangeState(data);
                });
            }
            // this.io.emit('toolchange:status');
            // this.emit('status');
        } else {
            log.warn('Missing configuration for tool change.');
        }
    }

    macroPutTool(toolBase, slotX) {
        return `
            ; Absolute positioning
            G90

            ; Raise to tool change Z
            G53 Z${toolBase.zsafe}
            ; Go to tool change X,Y
            G53 X${slotX} Y${toolBase.ysafe}

            ; Wait until the planner queue is empty
            %wait
            G53 Z${toolBase.zpos}
            %wait
            G53 Y${toolBase.ypos}
            %wait
            G4 P2
            %releaseTool
            ; Go to Clearance Height
            G53 Z${toolBase.zsafe}
            %wait
            G4 P2
            %grabTool
        `;
    }

    macroGetTool(toolBase, slotX) {
        return `
            ; Get te new tool
            G90

            ; Raise to tool change Z
            G53 Z${toolBase.zsafe}
            ; Go to tool change X,Y
            G53 X${slotX} Y${toolBase.ypos}

            ; Wait until the planner queue is empty
            %wait
            %releaseTool
            ;wait 2 seconds
            G4 P2
            G53 Z${toolBase.zpos}
            %wait
            G4 P2
            %grabTool
            G4 P2
            G53 Y${toolBase.ysafe}
            %wait
            ; Go to Clearance Height
            G53 Z${toolBase.zsafe}
            %wait
        `;
    }

    macroDoProbe(probe, originalOffset) {
        const PROBE_FEEDRATE = 20;
        return `
            ; Go to Clearance Height
            G53 Z${probe.zsafe}
            %wait
            ; Go to tool probe X,Y
            G53 X${probe.xpos} Y${probe.ypos}
            ; Wait until the planner queue is empty
            %wait

            ; Cancel tool length offset
            G49

            ; Probe toward workpiece with a maximum probe distance
            G91
            G38.2 Z${probe.distance} F${PROBE_FEEDRATE}
            G90
            ; A dwell time of one second to make sure the planner queue is empty
            G4 P1

            ; Update the tool length offset
            G43.1 Z[posz - ${originalOffset}]
    
            ; Retract from the touch plate
            G91 ; Relative positioning
            G0 Z${probe.zsafe}
            G90 ; Absolute positioning
    
        `;
    }

    macroSetup() {
        return `
            ; Wait until the planner queue is empty
            %wait

            ; Keep a backup of current work position
            %X0=posx, Y0=posy, Z0=posz
            %WCS = modal.wcs
            %PLANE = modal.plane
            %UNITS = modal.units
            %DISTANCE = modal.distance
            %FEEDRATE = modal.feedrate
            %SPINDLE = modal.spindle
            %COOLANT = modal.coolant

            ; Stop spindle
            M5
            ; wiat 5 seconds for the spindle to  stop
            G4 P5

            ; Absolute positioning
            G90
        `;
    }

    macroReturnOriginalPosition() {
        return `
            ; Go to previous work position
            G0 X[X0] Y[Y0]
            G0 Z[Z0]
            ; Restore modal state
            [WCS] [PLANE] [UNITS] [DISTANCE] [FEEDRATE] [SPINDLE] [COOLANT]
            %resume
        `;
    }

    returnToolChangeMacro(tool) {
        if (!tool.trim().length && !this.currentToolInSpindle) {
            log.debug(`No tool ${tool.trim()}`);
            return `M0 (No tool)
            $X
            `;
        }
        const slotName = tool.trim().toLowerCase().replace('t', 'slot');
        if (this.currentToolInSpindle === slotName) {
            log.debug(`Tool already in spindle ${tool.trim()}`);
            return '%resume';
        }
        // TODO: Get current slected machine from UI
        const machine = _find(config.get('machines'), { name: 'Cue Machine' });
        const toolBase = machine.toolBase;
        // const probe = machine.probeLocation;
        let macroData = this.macroSetup();

        if (this.currentToolInSpindle) {
            const toolIndex = parseInt(this.currentToolInSpindle.replace('slot', ''), 2);
            if (this.state.toolholders[toolIndex - 1].state !== 'Open') {
                log.debug(`Tool slot occupied ${this.currentToolInSpindle}`);
                return `M0 (Tool slot ${toolIndex} not open)
                $X
                `;
            }
            macroData += this.macroPutTool(toolBase, machine.toolSlots[this.currentToolInSpindle]);
            this.currentToolInSpindle = null;
        }

        if (tool) {
            const slotX = machine.toolSlots[slotName];
            const toolIndex = parseInt(slotName.replace('slot', ''), 2);
            log.debug(`Tool index ${toolIndex}`);
            if (this.state.toolholders[toolIndex - 1].state === 'Open') {
                log.debug(`Tool slot empty ${tool.trim()}`);
                return `M0 (No tool in slot ${toolIndex})
                $X
                `;
            }
            macroData += this.macroGetTool(toolBase, slotX);
            this.currentToolInSpindle = slotName;
        }

        macroData += this.macroReturnOriginalPosition();

        return macroData;
    }

    setToolChangeState(data) {
        const states = data.split(',');
        const self = this;
        let tmpStates = self.state.toolholders;

        for (let i = 2; i < states.length; i++) {
            tmpStates[i - 2].state = (states[i] === '1' ? 'Occupied' : 'Open');
        }
        this.state = {
            connected: true,
            release: (states[0].indexOf(1) === 3 ? 'ON' : 'OFF'),
            blowout: (states[1].indexOf(1) === 3 ? 'ON' : 'OFF'),
            toolholders: tmpStates
        };
        this.controller.emit('toolchange:status', self.state);
        log.debug('setToolChangeState - ToolChange', self.state);
    }

    emit(eventName, options) {
        if (this.io) {
            this.io.emit(eventName, options);
        } else {
            log.warn('Tool change service is not connected.');
        }
    }

    get status() {
        return this.currentState;
    }

    stop() {
        if (this.io) {
            this.io.close();
            this.io = null;
        }
    }

    toJson() {
        return {
            toolchange: this.state
        };
    }
}

export default ToolChange;
