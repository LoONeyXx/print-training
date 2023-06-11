import React from 'react';
import './Word.css';
function Word({ activeClass, children }) {
    return <li className={`word ${activeClass}`}>{children}</li>;
}

export default Word;
