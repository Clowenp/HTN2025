import React from 'react';
import './Checkbox.css';

const Checkbox = () => {
    return (
        <label className="custom-checkbox">
            <input type="checkbox" />
            <span className="checkmark"></span>
            Subscribe to newsletter
        </label>

    )
}

export default Checkbox;
