import React from 'react';
import './Letter.css';

function Letter({ letter, isActive }) {
    return <span className={`letter ${isActive ? 'letter_active' : ''}`}>{letter}</span>;
}
export default Letter;
