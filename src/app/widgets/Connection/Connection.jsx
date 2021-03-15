import find from 'lodash/find';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import { ToastNotification } from 'app/components/Notifications';
import i18n from 'app/lib/i18n';

class Connection extends PureComponent {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    isPortInUse = (port) => {
        const { state } = this.props;
        port = port || state.port;
        const o = find(state.ports, { port }) || {};
        return !!(o.inuse);
    };

    renderPortOption = (option) => {
        const { label, inuse, manufacturer } = option;
        const styles = {
            option: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
            }
        };

        return (
            <div style={styles.option} title={label}>
                <div>
                    {inuse && (
                        <span>
                            <i className="fa fa-lock" />
                            <Space width="8" />
                        </span>
                    )}
                    {label}
                </div>
                {manufacturer &&
                <i>{i18n._('Manufacturer: {{manufacturer}}', { manufacturer })}</i>
                }
            </div>
        );
    };

    renderPortValue = (option) => {
        const { state } = this.props;
        const { label, inuse } = option;
        const notLoading = !(state.loading);
        const canChangePort = notLoading;
        const style = {
            color: canChangePort ? '#333' : '#ccc',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        };
        return (
            <div style={style} title={label}>
                {inuse && (
                    <span>
                        <i className="fa fa-lock" />
                        <Space width="8" />
                    </span>
                )}
                {label}
            </div>
        );
    };

    renderBaudrateValue = (option) => {
        const { state } = this.props;
        const notLoading = !(state.loading);
        const notInUse = !(this.isPortInUse(state.port));
        const canChangeBaudrate = notLoading && notInUse;
        const style = {
            color: canChangeBaudrate ? '#333' : '#ccc',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        };
        return (
            <div style={style} title={option.label}>{option.label}</div>
        );
    };

    render() {
        const { state, actions } = this.props;
        const {
            connected,
            port, baudrate,
            alertMessage
        } = state;
        const notConnected = !connected;

        return (
            <div>
                {alertMessage && (
                    <ToastNotification
                        style={{ margin: '-10px -10px 10px -10px' }}
                        type="error"
                        onDismiss={actions.clearAlert}
                    >
                        {alertMessage}
                    </ToastNotification>
                )}
                <div className="form-group">
                    <label className="control-label">{i18n._('Port')}: </label>
                    <label className="control-label">{port}</label>
                </div>
                <div className="form-group">
                    <label className="control-label">{i18n._('Baud rate')}: </label>
                    <label className="control-label">{baudrate}</label>
                </div>
                <div className="btn-group btn-group-sm">
                    {notConnected && (
                        <label className="control-label">Not connected</label>
                    )}
                    {connected && (
                        <label className="control-label">Connected to the CNC controller</label>
                    )}
                </div>
            </div>
        );
    }
}

export default Connection;
