import React from 'react';
import './Rules.css';

function Rules({ name, rules, title, children }) {
    return (
        <div className={`rules  ${rules && 'rules__' + name}`}>
            <h2 className='rules__item-title'>{title}</h2>
            {children}
        </div>
    );
}
export default Rules;
