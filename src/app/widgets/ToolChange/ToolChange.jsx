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
        config: PropTypes.object
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
        const { state } = this.props;

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
                </div>

                <div className={classNames('row', 'no-gutters', styles.holder)}>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {state.toolchange.toolholders[0].title}
                        </span>
                        {state.toolchange.toolholders[0].state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {state.toolchange.toolholders[0].state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {state.toolchange.toolholders[1].title}
                        </span>
                        {state.toolchange.toolholders[1].state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {state.toolchange.toolholders[1].state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {state.toolchange.toolholders[2].title}
                        </span>
                        {state.toolchange.toolholders[2].state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {state.toolchange.toolholders[2].state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {state.toolchange.toolholders[3].title}
                        </span>
                        {state.toolchange.toolholders[3].state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {state.toolchange.toolholders[3].state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>
                </div>
                <div className={classNames('row', 'no-gutters', styles.holder)}>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {state.toolchange.toolholders[4].title}
                        </span>
                        {state.toolchange.toolholders[4].state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {state.toolchange.toolholders[4].state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {state.toolchange.toolholders[5].title}
                        </span>
                        {state.toolchange.toolholders[5].state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {state.toolchange.toolholders[5].state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {state.toolchange.toolholders[6].title}
                        </span>
                        {state.toolchange.toolholders[6].state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {state.toolchange.toolholders[6].state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                    >
                        <span style={{ marginLeft: 5, marginRight: 5 }}>
                            {state.toolchange.toolholders[7].title}
                        </span>
                        {state.toolchange.toolholders[7].state === 'Open' && (
                            <i className="fa fa-circle-o" style={{ fontSize: 16 }} />
                        )}
                        {state.toolchange.toolholders[7].state === 'Occupied' && (
                            <i className="fa fa-arrow-circle-o-down" style={{ fontSize: 16 }} />
                        )}
                    </RepeatButton>

                </div>
            </div>
        );
    }
}

export default ToolChange;
