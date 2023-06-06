import React from 'react';
import styles from './Header.module.css';

function Header(props) {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>Print training</h1>
        </header>
    );
}
export default Header;
