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

    returnToolChangeMacro(tool) {
        // TODO: Get currnt slected machine
        const machine = _find(config.get('machines'), { name: 'Cue Machine' });
        const toolBase = machine.toolBase;
        const probe = machine.probeLocation;
        const slotName = tool.trim().toLowerCase().replace('t', 'slot');
        log.debug(machine);
        const slotX = machine.toolSlots[slotName];
        // { zpos: -10, xpos: -10, ypos: -57, ysafe: -40, zsafe: -10 } { zsafe: -10, xpos: -10, ypos: -57 }
        log.debug(toolBase, probe, slotName, slotX);
        let macroData = `; Wait until the planner queue is empty
        %wait

        ; Set user-defined variables
        %CLEARANCE_HEIGHT = 100
        %TOOL_CHANGE_X = ${slotX}
        %TOOL_CHANGE_Y = ${toolBase.ypos - toolBase.ysafe}
        %TOOL_CHANGE_Z = ${toolBase.zpos}
        %TOOL_PROBE_X = ${probe.xpos}
        %TOOL_PROBE_Y = ${probe.ypos}
        %TOOL_PROBE_Z = ${probe.zsafe}
        %PROBE_DISTANCE = 15
        %PROBE_FEEDRATE = 20
        %TOUCH_PLATE_HEIGHT = 10
        %RETRACTION_DISTANCE = 10

        ; Keep a backup of current work position
        %X0=posx, Y0=posy, Z0=posz

        ; Save modal state
        ; * Work Coordinate System: G54, G55, G56, G57, G58, G59
        ; * Plane: G17, G18, G19
        ; * Units: G20, G21
        ; * Distance Mode: G90, G91
        ; * Feed Rate Mode: G93, G94
        ; * Spindle State: M3, M4, M5
        ; * Coolant State: M7, M8, M9
        %WCS = modal.wcs
        %PLANE = modal.plane
        %UNITS = modal.units
        %DISTANCE = modal.distance
        %FEEDRATE = modal.feedrate
        %SPINDLE = modal.spindle
        %COOLANT = modal.coolant

        ; Stop spindle
        M5
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
        %releaseTool
    
        ; Go to Clearance Height
        G53 Z[CLEARANCE_HEIGHT]
        ; Go to tool probe X,Y
        G53 X[TOOL_PROBE_X] Y[TOOL_PROBE_Y]
        ; Go to tool probe Z
        G53 Z[TOOL_PROBE_Z]

        ; Wait until the planner queue is empty
        %wait

        ; Pause the program before probing
        M1

        ; Cancel tool length offset
        G49

        ; Probe toward workpiece with a maximum probe distance
        G91 ; Relative positioning
        G38.2 Z-[PROBE_DISTANCE] F[PROBE_FEEDRATE]
        G90 ; Absolute positioning

        ; A dwell time of one second to make sure the planner queue is empty
        G4 P1

        ; Update the tool length offset
        G43.1 Z[posz - TOUCH_PLATE_HEIGHT]

        ; Retract from the touch plate
        G91 ; Relative positioning
        G0 Z[RETRACTION_DISTANCE]
        G90 ; Absolute positioning

        ; Raise to tool change Z
        G53 Z[TOOL_CHANGE_Z]
        ; Go to tool change X,Y
        G53 X[TOOL_CHANGE_X] Y[TOOL_CHANGE_Y]

        ; Wait until the planner queue is empty
        %wait

        ; Go to previous work position
        G0 X[X0] Y[Y0]
        G0 Z[Z0]
        %grabTool
        ; Restore modal state
        [WCS] [PLANE] [UNITS] [DISTANCE] [FEEDRATE] [SPINDLE] [COOLANT]
        `;
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
