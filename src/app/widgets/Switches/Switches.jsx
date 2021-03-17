// import get from 'lodash/get';
// import pubsub from 'pubsub-js';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Switch from './components/Switch';
// import settings from 'app/config/settings';
// import store from 'app/store';
// import controller from 'app/lib/controller';


class Switches extends PureComponent {
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
                    <Switch
                        title={state.switches.switch[0].title}
                        value={state.switches.switch[0].state}
                    />
                    <Switch
                        title={state.switches.switch[1].title}
                        value={state.switches.switch[1].state}
                    />
                    <Switch
                        title={state.switches.switch[2].title}
                        value={state.switches.switch[2].state}
                    />
                    <Switch
                        title={state.switches.switch[3].title}
                        value={state.switches.switch[3].state}
                    />
                </div>
                <div>
                    <Switch
                        title={state.switches.switch[4].title}
                        value={state.switches.switch[4].state}
                    />
                    <Switch
                        title={state.switches.switch[5].title}
                        value={state.switches.switch[5].state}
                    />
                    <Switch
                        title={state.switches.switch[6].title}
                        value={state.switches.switch[6].state}
                    />
                    <Switch
                        title={state.switches.switch[7].title}
                        value={state.switches.switch[7].state}
                    />
                </div>
            </div>
        );
    }
}

export default Switches;
