import './App.css';
import Header from './Header';
import React, { useEffect } from 'react';
import Letter from './Letter';
import Word from './Word';
import { text } from '../contexts/CurrentText';
function App() {
    const [currentText, setCurrentText] = React.useState('');
    const [current, setCurrent] = React.useState({ count: 0, symbol: '' });

    useEffect(() => {
        setCurrent((prev) => ({ ...prev, symbol: currentText[current.count] }));
    }, [current.symbol, currentText, current.count]);

    const startGame = React.useCallback(
        function startGame() {
            setCurrentText(text);
            setCurrent({ count: 0, symbol: '' });
        },
        [text]
    );

    const getCurrentKey = React.useCallback(
        (e) => {
            console.log(current);
            if (current.symbol === e.key) {
                setCurrent((prev) => ({ count: prev.count + 1 }));
            }
            return e.key;
        },
        [current]
    );
    useEffect(() => {
        window.addEventListener('keydown', getCurrentKey);
        return () => {
            window.removeEventListener('keydown', getCurrentKey);
        };
    }, [getCurrentKey]);

    return (
        <div className='App'>
            <Header />
            <main className='content'>
                <div className='container'>
                    <button onClick={startGame} className='button'>
                        Начать тренировку
                    </button>
                    <ul className='words-container'>
                        {currentText.split('').map((letter, index) => (
                            <Letter key={index} letter={letter} isActive={index < current.count} />
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default App;
