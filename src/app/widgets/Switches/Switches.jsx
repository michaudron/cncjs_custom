// import get from 'lodash/get';
// import pubsub from 'pubsub-js';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
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
            <div>{JSON.stringify(state.switches)}</div>
        );
    }
}

export default Switches;
