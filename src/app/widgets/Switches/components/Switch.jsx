import PropTypes from 'prop-types';
import React from 'react';

const Switch = (props) => {
    const { title, value } = props;

    return (
        <div
            style={{
                whiteSpace: 'nowrap',
                verticalAlign: '-0.5em',
                textAlign: 'left'
            }}
        >
            <span
                style={{
                    lineHeight: '1em',
                    margin: '0 0.5em'
                }}
            >
                {title} =
            </span>
            <span
                style={{
                    lineHeight: '1em',
                    margin: '0 0.1em',
                    minWidth: 16
                }}
            >
                {value ? 'ON' : 'OFF'}
            </span>
        </div>
    );
};

Switch.propTypes = {
    title: PropTypes.string,
    value: PropTypes.bool
};

export default Switch;
