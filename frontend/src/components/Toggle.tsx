import React from 'react';
import './Toggle.css';

const Toggle = ({ onToggle }: { onToggle: () => void }) => {
    return (
        <label className="switch">
            <input type="checkbox" onChange={onToggle} />
            <span className="slider"></span>
        </label>
    )
}

export default Toggle;
