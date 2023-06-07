import './App.css';
import Header from './Header';
import React, { useEffect } from 'react';
import Letter from './Letter';
import { texts } from '../contexts/CurrentText';
function App() {
    const [currentText, setCurrentText] = React.useState('');
    const [current, setCurrent] = React.useState({ count: 0, symbol: '' });
    const [isPlaying, setPlaying] = React.useState(false);
    const [statistics, setStatistics] = React.useState({ well: 0, miss: 0, bpm: 0, accuracy: 0 });
    const [timer, setTimer] = React.useState(0);
    const startGame = React.useCallback(
        function startGame(e) {
            const random = Math.floor(Math.random() * (texts.length - 1 - 1 + 1) + 1);
            setCurrentText((prev) => (prev ? `${prev} ${texts[random]}`.trim() : texts[random]));

            setStatistics({ well: 0, miss: 0, bpm: 0, accuracy: 100 });
            setCurrent((prev) => ({ count: 0, symbol: currentText[prev.count] }));
            setPlaying(true);
            setTimer(0);
        },
        [currentText]
    );

    useEffect(() => {
        if (isPlaying) {
            console.log(isPlaying);
            if (currentText.length > 200) {
                console.log(200);
                return;
            }

            const random = Math.floor(Math.random() * (texts.length - 1 - 1 + 1) + 1);

            setCurrentText((prev) => (prev ? `${prev} ${texts[random]}`.trim() : texts[random]));
            // setCurrentText((prev) => `${prev} ${texts[random]}`);
            // }
        } else {
            setCurrentText('');
        }
    }, [isPlaying, currentText]);
    function endGame() {
        setPlaying(false);
    }
    useEffect(() => {
        if (current.count === currentText.length) {
            endGame();
        }
    });
    useEffect(() => {
        setStatistics((prev) => ({ ...prev, bpm: (60 / timer) * prev.well }));
    }, [timer]);
    useEffect(() => {
        setStatistics((prev) => ({
            ...prev,
            accuracy: prev.well ? (prev.well * 100) / (prev.well + prev.miss) : 100,
        }));
    }, [statistics.miss, statistics.well]);
    useEffect(() => {
        let timerId = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);

        if (!isPlaying) {
            clearInterval(timerId);
        }

        return () => {
            clearInterval(timerId);
        };
    }, [isPlaying]);

    useEffect(() => {
        if (currentText) {
            setCurrent((prev) => ({
                ...prev,
                symbol: currentText[current.count] === ' ' ? '_' : currentText[current.count],
            }));
        }
    }, [currentText, current.count]);

    const isSomeSymbols = React.useCallback(function isSomeSymbols(symbol) {
        return symbol === 'Shift' || symbol === 'Alt' || symbol === 'Control' || symbol === 'Escape';
    }, []);
    const isBackspace = React.useCallback(
        (symbol) => {
            return symbol === ' ' && current.symbol === '_';
        },
        [current.symbol]
    );

    const getCurrentKey = React.useCallback(
        (e) => {
            if ((current.symbol === e.key && !isSomeSymbols(e.key)) || isBackspace(e.key)) {
                setCurrent((prev) => ({ count: prev.count + 1, symbol: currentText[prev.count + 1] }));
                setStatistics((prev) => ({ ...prev, well: prev.well + 1 }));
                return;
            }

            if (e.key === 'Escape') {
                setPlaying(false);
            }
            if (isSomeSymbols(e.key)) {
                return;
            }

            setStatistics((prev) => ({ ...prev, miss: prev.miss + 1 }));
        },
        [currentText, isSomeSymbols, current.symbol, isBackspace]
    );
    useEffect(() => {
        window.addEventListener('keydown', getCurrentKey);
        if (!isPlaying) {
            window.removeEventListener('keydown', getCurrentKey);
        }
        return () => {
            window.removeEventListener('keydown', getCurrentKey);
        };
    }, [getCurrentKey, isPlaying]);
    const getLevelAccuracy = React.useCallback((accuracy) => {
        if (accuracy > 90) {
            return 'accuracy-count-number_high';
        }
        if (accuracy > 80) {
            return 'accuracy-count-number_medium';
        }

        return '';
    }, []);
    const getLevelBpm = React.useCallback(function getLevelBpm(bpm) {
        if (bpm > 100 && bpm < 200) {
            return 'bpm-count-number_medium';
        }

        if (bpm > 200) {
            return 'bpm-count-number_high';
        }

        return '';
    }, []);

    return (
        <div className='App'>
            <Header />
            <main className='content'>
                <div className='container'>
                    <button
                        disabled={isPlaying && true}
                        type='button'
                        onClick={startGame}
                        className={`button ${isPlaying && 'button_disabled'}`}
                    >
                        Начать тренировку
                    </button>
                    <div className='statistic-group'>
                        <div className='statistic'>
                            <p className='current-count'>
                                Well:<span className='current-count-number'> {statistics.well}</span>
                            </p>
                            <p className='miss-count'>
                                Miss:<span className='miss-count-number'> {statistics.miss}</span>
                            </p>
                            <p className='bpm-count'>
                                BPM:
                                <span className={`bpm-count-number ${getLevelBpm(statistics.bpm)}`}>
                                    {' '}
                                    {statistics.bpm ? statistics.bpm.toFixed(0) : 0}
                                </span>
                            </p>
                            <p className='accuracy-count'>
                                Accuracy:{' '}
                                <span className={`accuracy-count-number ${getLevelAccuracy(statistics.accuracy)}`}>
                                    {statistics.accuracy.toFixed(1)}%
                                </span>
                            </p>
                        </div>
                        <p className='current'>{current.symbol}</p>
                    </div>

                    <ul className='words-container'>
                        {currentText.split('').map((letter, index) => (
                            <li className='list-letter' key={index}><Letter key={index} letter={letter} isActive={index < current.count} /></li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default App;
