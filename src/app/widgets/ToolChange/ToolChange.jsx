// import get from 'lodash/get';
// import pubsub from 'pubsub-js';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import RepeatButton from 'app/components/RepeatButton';
import styles from './index.styl';
import Holder from './components/Holders';

// import settings from 'app/config/settings';
// import store from 'app/store';
// import controller from 'app/lib/controller';


class ToolChange extends PureComponent {
    static propTypes = {
        state: PropTypes.object,
        config: PropTypes.object,
        actions: PropTypes.object
    };

    observer = null;

    componentDidMount() {
        // this.subscribe();
    }

    componentWillUnmount() {
        // this.unsubscribe();
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        const { state, actions } = this.props;
        const fieldList = state.toolchange.toolholders.map((holder, index) => {
            if (index < 4) {
                return (
                    <RepeatButton
                        key={index.toString()}
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            actions.toolGet(holder.title, holder.state);
                        }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {holder.title}
                        </span>
                        {holder.state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {holder.state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>
                );
            }
            return (null);
        });

        const fieldList2 = state.toolchange.toolholders.map((holder, index) => {
            if (index > 3) {
                return (
                    <RepeatButton
                        key={index.toString()}
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            actions.toolGet(holder.title, holder.state);
                        }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {holder.title}
                        </span>
                        {holder.state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {holder.state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>
                );
            }
            return (null);
        });
        return (
            <div>
                <div>
                    <Holder
                        title="Release"
                        value={state.toolchange.release}
                    />
                    <Holder
                        title="Blowout"
                        value={state.toolchange.blowout}
                    />
                    <Holder
                        title="Tool In Spindle"
                        value={state.toolchange.currentToolInSpindle}
                    />
                </div>

                <div className={classNames('row', 'no-gutters', styles.holder)}>
                    {fieldList}
                </div>
                <div className={classNames('row', 'no-gutters', styles.holder)}>
                    {fieldList2}
                </div>
            </div>
        );
    }
}

export default ToolChange;
