import clientIO from 'socket.io-client';
import _find from 'lodash/find';
import settings from '../../config/settings';
import logger from '../../lib/logger';
import config from '../configstore';

const log = logger('service:toolchange');

class ToolChange {
    io = null;

    currentState = null;

    controller = null;

    state = {
        connected: false,
        release: false,
        blowout: false,
        currentToolInSpindle: null,
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

    isToolInSlot(slot) {
        const self = this;
        log.debug(`Is tool ${slot} in slot`);
        if (slot) {
            const index = slot.replace('slot', '').trim() * 1;
            if (self.state.toolholders[index - 1]) {
                return self.state.toolholders[index - 1].state !== 'Open';
            } else {
                log.error(`Invalid slot: ${slot}`);
            }
        }
        return -1;
    }

    macroPutTool(toolBase, slotX, slotName) {
        return `
            %wait
            ;Absolute positioning
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
            %releaseTool ${slotName}
            ; Go to Clearance Height
            G53 Z${toolBase.zsafe}
            %wait
            G4 P2
            %grabTool
        `;
    }

    macroGetTool(toolBase, slotX, slotName) {
        return `
            %wait
            ; Get te new tool
            G90

            ; Raise to tool change Z
            G53 Z${toolBase.zsafe}
            ; Go to tool change X,Y
            G53 X${slotX} Y${toolBase.ypos}

            ; Wait until the planner queue is empty
            %wait
            %releaseTool ${slotName}
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
            %setcurrenttool ${slotName}
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
        const self = this;
        const machine = _find(config.get('machines'), { name: 'Cue Machine' });
        this.state.currentToolInSpindle = this.state.currentToolInSpindle || machine.toolInSpindle;
        const currentToolInSpindle = this.state.currentToolInSpindle;

        if (!tool.trim().length && !currentToolInSpindle) {
            log.debug(`No tool ${tool.trim()}`);
            return `M0 (No tool)
            $X
            `;
        }
        const slotName = tool.trim().toLowerCase().replace('t', 'slot');
        if (currentToolInSpindle === slotName) {
            log.debug(`Tool already in spindle ${tool.trim()}`);
            return `(Tool already in spindle ${tool}})
            %resume`;
        }

        const toolBase = machine.toolBase;
        // const probe = machine.probeLocation;
        let macroData = self.macroSetup();

        if (currentToolInSpindle) {
            log.debug(`Return tool to ${currentToolInSpindle}`);
            if (self.isToolInSlot(currentToolInSpindle)) {
                log.debug(`Tool slot occupied ${currentToolInSpindle}`);
                return `M0 (Put tool in ${currentToolInSpindle} error - slot not open)
                $X
                `;
            }
            macroData += self.macroPutTool(toolBase, machine.toolSlots[currentToolInSpindle], currentToolInSpindle);
        }

        if (tool && tool !== 'putaway') {
            const slotX = machine.toolSlots[slotName];
            log.debug(`Get tool from ${slotName}`);
            if (!self.isToolInSlot(slotName)) {
                log.debug(`Tool slot empty ${tool.trim()}`);
                return `M0 (Get tool from slot ${slotName} - error slot is empty)
                $X
                `;
            }
            macroData += self.macroGetTool(toolBase, slotX, slotName);
        }

        macroData += self.macroReturnOriginalPosition();

        return macroData;
    }

    setCurrentTool(slot) {
        this.state.currentToolInSpindle = slot;
        let machines = config.get('machines');
        machines.forEach((machine) => {
            if (machine.name === 'Cue Machine') {
                machine.toolInSpindle = slot;
                config.set('machines', machines);
            }
        });
    }

    setToolChangeState(data) {
        const states = data.split(',');
        const self = this;
        let tmpStates = self.state.toolholders;

        for (let i = 2; i < states.length; i++) {
            tmpStates[i - 2].state = (states[i] === '1' ? 'Occupied' : 'Open');
        }
        self.state = {
            connected: true,
            currentToolInSpindle: self.state.currentToolInSpindle,
            release: (states[0].indexOf(1) === 3 ? 'ON' : 'OFF'),
            blowout: (states[1].indexOf(1) === 3 ? 'ON' : 'OFF'),
            toolholders: tmpStates
        };
        self.controller.emit('toolchange:status', self.state);
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
