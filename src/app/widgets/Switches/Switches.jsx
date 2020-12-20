import get from 'lodash/get';
import pubsub from 'pubsub-js';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import settings from 'app/config/settings';
import store from 'app/store';
import controller from 'app/lib/controller';


class Switches extends PureComponent {
    static propTypes = {
        config: PropTypes.object,
        port: PropTypes.string
    };

    pubsubTokens = [];

    observer = null;

    componentDidMount() {
        this.subscribe();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillReceiveProps(nextProps) {

    }

    subscribe() {
        const tokens = [
            pubsub.subscribe('message:connect', () => {
                // Post a message to the iframe window
                this.postMessage('change', {
                    port: controller.port,
                    controller: controller.type
                });
            }),
            pubsub.subscribe('message:resize', (type, payload) => {
                const { scrollHeight } = { ...payload };
                this.resize({ height: scrollHeight });
            })
        ];
        this.pubsubTokens = this.pubsubTokens.concat(tokens);
    }

    unsubscribe() {
        this.pubsubTokens.forEach((token) => {
            pubsub.unsubscribe(token);
        });
        this.pubsubTokens = [];
    }

    postMessage(type = '', payload) {
        const token = store.get('session.token');
        const target = get(this.iframe, 'contentWindow');
        const message = {
            token: token,
            version: settings.version,
            action: {
                type: type,
                payload: {
                    ...payload
                }
            }
        };

        if (target) {
            target.postMessage(message, '*');
        }
    }

    reload(forceGet = false) {
    }

    resize(options) {
    }

    render() {
        return (
            <div>Switches</div>
        );
    }
}

export default Switches;
