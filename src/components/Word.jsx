import React from 'react';
import './Word.css';
function Word({ isActive, children }) {
    return <li className={`word ${isActive}`}>{children}</li>;
}

export default Word;
