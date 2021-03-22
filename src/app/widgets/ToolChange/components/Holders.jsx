import PropTypes from 'prop-types';
import React from 'react';

const Holders = (props) => {
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
                {value}
            </span>
        </div>
    );
};

Holders.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string
};

export default Holders;
