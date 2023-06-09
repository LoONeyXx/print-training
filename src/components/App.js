import './App.css';
import Header from './Header';
import React, { useEffect, useState } from 'react';
import Letter from './Letter';
import Word from './Word';
import useSymbol from './hooks/useSymbol';
import useWord from './hooks/useWord';
import useStatistic from './hooks/useStatistic';
import useText from './hooks/useText';
import { texts } from '../contexts/CurrentText';
import useEventKey from './hooks/useEventKey';
import useClass from './hooks/useClass';
function App() {
    const [isPlaying, setPlaying] = React.useState(false);
    const [mode, setMode] = React.useState('standart');
    const [currentText, setStartText, setCurrentText] = useText([]);
    const { currentWord, setNextWord } = useWord(currentText);
    const { currentSymbol, setNextSymbol } = useSymbol(currentWord.word);
    const [statistics, resetStatistics, setSuccess, setMiss] = useStatistic(isPlaying);
    const [leftWords, setLeftWords] = React.useState([]);
    const [isSuccsessSymbol, isSuccsessWord, isSomeSymbols] = useEventKey(currentSymbol, currentWord);
    const [getSumbitText, getWordClass] = useClass(currentWord, leftWords, isPlaying);

    useEffect(() => {
        console.log(currentWord);
    }, [currentWord]);

    useEffect(() => {
        setLeftWords(currentText.map((el, index) => index));
    }, [currentText]);

    const getLevelAccuracy = React.useCallback(() => {
        if (statistics.accuracy > 90) {
            return 'accuracy-count-number_high';
        }
        if (statistics.accuracy > 80) {
            return 'accuracy-count-number_medium';
        }

        return '';
    }, [statistics]);

    const getLevelBpm = React.useCallback(
        function getLevelBpm() {
            if (statistics.bpm > 100 && statistics.bpm < 200) {
                return 'bpm-count-number_medium';
            }

            if (statistics.bpm > 200) {
                return 'bpm-count-number_high';
            }

            return '';
        },
        [statistics]
    );

    const startGame = React.useCallback(() => {
        setPlaying(true);
        setStartText(texts, 1);
    }, [setStartText]);

    const handleKey = React.useCallback(
        (e) => {
            if (isSomeSymbols(e)) {
                console.log(isSomeSymbols(e));
                return;
            }
            if (isSuccsessWord(e) && leftWords.length === 1) {
                setPlaying(false);
                setCurrentText([]);
                setNextSymbol(0);
                setNextWord(0);
                resetStatistics()
                return;
            }
            if (isSuccsessWord(e)) {
                setNextWord(currentWord.count === currentText.length ? '' : currentWord.count + 1);
                setNextSymbol(0);
                setLeftWords((prev) => prev.filter((el) => el !== currentWord.count));
                return;
            }
            if (isSuccsessSymbol(e)) {
                console.log('else');
                setNextSymbol(currentSymbol.count + 1);
                setSuccess(statistics.success + 1);
                return;
            }

            setNextSymbol(0);
            const successed = statistics.success - currentSymbol.count;
            setMiss(statistics.miss + 1);
            setSuccess(successed);
        },
        [
            currentText,
            statistics,
            setMiss,
            isSomeSymbols,
            isSuccsessWord,
            isSuccsessSymbol,
            currentSymbol.count,
            currentWord.count,
            setNextSymbol,
            setNextWord,
            setSuccess,
        ]
    );
    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        if (!isPlaying) {
            window.removeEventListener('keydown', handleKey);
        }
        return () => {
            window.removeEventListener('keydown', handleKey);
        };
    }, [handleKey, isPlaying]);

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
                        {getSumbitText()}
                    </button>
                    <div className='statistic-group'>
                        <div className='statistic'>
                            <p className='current-count'>
                                Success:<span className='current-count-number'> {statistics.success}</span>
                            </p>
                            <p className='miss-count'>
                                Miss:<span className='miss-count-number'> {statistics.miss}</span>
                            </p>
                            <p className='bpm-count'>
                                BPM:
                                <span className={`bpm-count-number ${getLevelBpm()}`}>
                                    {' '}
                                    {statistics.bpm ? statistics.bpm.toFixed(0) : 0}
                                </span>
                            </p>
                            <p className='accuracy-count'>
                                Accuracy:{' '}
                                <span className={`accuracy-count-number ${getLevelAccuracy()}`}>
                                    {statistics.accuracy.toFixed(1)}%
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className={`input ${currentWord.word && 'input_active'}`}>
                        {currentWord.word &&
                            currentWord.word
                                .split('')
                                .map((letter, index) => (
                                    <Letter key={index} letter={letter} isActive={currentSymbol.count > index} />
                                ))}
                    </div>
                    <ul className='words-container'>
                        {currentText.length > 0 &&
                            currentText.map((word, indexWord) => (
                                <Word isActive={getWordClass(indexWord)} key={indexWord}>
                                    {word.split('').map((letter, index) => (
                                        <Letter isActive={false} key={index} letter={letter} />
                                    ))}
                                </Word>
                            ))}
                    </ul>
                    <ul className='mode-group'>
                        <li className='mode__item'>
                            <button name='standart' className={`button ${isPlaying && 'button_disabled'}`}>
                                Standart
                            </button>
                        </li>
                        <div className='mode__item'>
                            <button name='random' className={`button ${isPlaying && 'button_disabled'}`}>
                                Random
                            </button>
                        </div>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default App;
