import './App.css';
import Header from './Header';
import React, { useEffect } from 'react';
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
    const [mode, setMode] = React.useState('');
    const [currentText, setStartText, setCurrentText] = useText([]);
    const { currentWord, setNextWord } = useWord(currentText);
    const { currentSymbol, setNextSymbol } = useSymbol(currentWord.word);
    const [statistics, resetStatistics, setSuccess, setMiss] = useStatistic(isPlaying);
    const [leftWords, setLeftWords] = React.useState([]);
    const [isSuccsessSymbol, isSuccsessWord, isSomeSymbols] = useEventKey(currentSymbol, currentWord);
    const [getSumbitText, getWordClass] = useClass(currentWord, leftWords, isPlaying);

    useEffect(() => {
        setLeftWords(currentText.map((el, index) => index));
    }, [currentText]);

    const getLevelAccuracy = React.useCallback(() => {
        if (statistics.accuracy > 90) {
            return 'count_high';
        }
        if (statistics.accuracy > 80) {
            return 'count_medium';
        }

        return 'count_low';
    }, [statistics]);

    const getLevelBpm = React.useCallback(
        function getLevelBpm() {
            if (statistics.bpm > 200) {
                return 'count_high';
            }
            if (statistics.bpm > 100 && statistics.bpm < 200) {
                return 'count_medium';
            }

            return 'count_low ';
        },
        [statistics]
    );
    useEffect(() => {
        console.log(leftWords);
    }, [leftWords]);
    const handleSuccessWord = React.useCallback(() => {
        if (mode === 'random') {
            const random = Math.floor(Math.random() * (leftWords.length - 2 - 0 + 1) + 0);
            const newArray = leftWords.filter((el) => el !== currentWord.count);
            setLeftWords(newArray);
            setNextWord(newArray[random]);
            setNextSymbol(0);
            return;
        }
        setNextWord(currentWord.count === currentText.length ? '' : currentWord.count + 1);
        setNextSymbol(0);
        setLeftWords((prev) => prev.filter((el) => el !== currentWord.count));
    }, [currentWord.count, currentText.length, leftWords, mode, setNextSymbol, setNextWord]);

    const startGame = React.useCallback(() => {
        setPlaying(true);
        setStartText(texts, 10);
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
                resetStatistics();
                setMode('');
                return;
            }
            if (isSuccsessWord(e)) {
                handleSuccessWord();
                return;
            }
            if (isSuccsessSymbol(e)) {
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
            handleSuccessWord,
            setCurrentText,
            leftWords.length,
            resetStatistics,
            statistics,
            setMiss,
            isSomeSymbols,
            isSuccsessWord,
            isSuccsessSymbol,
            currentSymbol.count,
            setNextSymbol,
            setNextWord,
            setSuccess,
        ]
    );

    const getGameState = React.useCallback(() => {
        return (!isPlaying && mode === '') || isPlaying;
    }, [isPlaying, mode]);

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
                        disabled={getGameState() && true}
                        type='button'
                        onClick={startGame}
                        className={`button ${getGameState() && 'button_disabled'}`}
                    >
                        {getSumbitText()}
                    </button>
                    <div className='statistic-group'>
                        <div className='statistic'>
                            <p className='statistic__count statistic__count_success'>
                                Success
                                <span className='current-count-number count_high'> {statistics.success}</span>
                            </p>
                            <p className='statistic__count statistic__count_miss'>
                                Miss<span className='miss-count-number count_low'> {statistics.miss}</span>
                            </p>
                            <p className='statistic__count statistic__count_bpm'>
                                BPM
                                <span className={`bpm-count-number ${getLevelBpm()}`}>
                                    {statistics.bpm ? statistics.bpm.toFixed(0) : 0}
                                </span>
                            </p>
                            <p className='statistic__count statistic__count_accuracy'>
                                Accuracy
                                <span className={`accuracy-count-number ${getLevelAccuracy()}`}>
                                    {statistics.accuracy.toFixed(2)}%
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
                    {isPlaying && (
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
                    )}

                    <div className='mode-group'>
                        <label className={`mode__item ${mode === 'standart' && 'mode__item_active'}`}>
                            <input
                                onChange={(e) => setMode(e.target.value)}
                                type='radio'
                                name='mode'
                                value='standart'
                                className='real-radio-btn'
                            />
                            <span className='custom-radio-btn'></span>
                            Standart
                        </label>
                        <label className={`mode__item ${mode === 'random' && 'mode__item_active'}`}>
                            <input
                                onChange={(e) => setMode(e.target.value)}
                                type='radio'
                                name='mode'
                                value='random'
                                className='real-radio-btn'
                            />
                            <span className='custom-radio-btn'></span>
                            Random
                        </label>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
