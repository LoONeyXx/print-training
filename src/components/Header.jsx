import React from 'react';
import styles from './Header.module.css';

function Header({ onRules, isActive }) {
    function handleClickRules() {
        onRules((prev) => !prev);
    }
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Print training</h1>
            <button
                disabled={!isActive}
                onClick={handleClickRules}
                className={styles.instruction}
            >
                Instruction
            </button>
        </header>
    );
}
export default Header;
