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

    context = null;

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

                this.io.on('toolchange:runmacro', (macro) => {
                    self.controller.command('gcode', macro, self.context);
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

    changeTool(newTool, context) {
        const { posx, posy, posz, posa, posb, posc, modal, tool } = { ...context };
        const machine = _find(config.get('machines'), { name: 'Cue Machine' });
        this.context = context;
        this.emit('toolchange:new', { newTool, posx, posy, posz, posa, posb, posc, modal, tool, machine });
    }

    setCurrentTool(slot) {
        const self = this;
        self.state.currentToolInSpindle = slot;
        let machines = config.get('machines');
        machines.forEach((machine) => {
            if (machine.name === 'Cue Machine') {
                machine.toolInSpindle = slot;
                config.set('machines', machines);
                self.controller.emit('toolchange:status', self.state);
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
