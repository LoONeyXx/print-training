import React from 'react';
import './Word.css';
function Word({ word, isActive, children }) {
    return <li className={`word ${isActive && 'word_active'}`}>{children}</li>;
}

export default Word;
