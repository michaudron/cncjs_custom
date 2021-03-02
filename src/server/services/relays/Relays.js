import clientIO from 'socket.io-client';
import settings from '../../config/settings';
import logger from '../../lib/logger';

const log = logger('service:relays');

class Relay {
    io = null;

    currentState = null;

    init(controller) {
        if (settings.backend.relayWS) {
            if (!this.io || !this.io.connected) {
                this.io = clientIO(settings.backend.relayWS);
                log.debug('Connecting to relay service: ' + settings.backend.relayWS);

                this.io.on('connect', () => {
                    log.debug('Connected to relay service');
                });

                this.io.on('connect_error', (error) => {
                    log.error(error);
                });

                this.io.on('relay:response', (data) => {
                    this.currentState = data;
                    controller.emit('relay:response', data);
                });

                this.io.on('relay:status', (data) => {
                    this.currentState = data;
                    controller.emit('relay:status', data);
                });
            }
            this.io.emit('relay:status');
            this.emit('status');
        } else {
            log.warn('Missing configuration for relays. M90 and M91 will not be enabled');
        }
    }

    emit(eventName, options) {
        if (this.io) {
            this.io.emit(eventName, options);
        } else {
            log.warn('Relay web service is not connected.');
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
            relays: this.currentState
        };
    }
}

export default Relay;
