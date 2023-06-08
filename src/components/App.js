import './App.css';
import Header from './Header';
import React, { useEffect } from 'react';
import Letter from './Letter';
import Word from './Word';
import useStart from './hooks/useStart';
import useStatistic from './hooks/useStatistic';
function App() {
    const [
        currentSymbol,
        currentWord,
        currentText,
        isPlaying,
        onStart,
        onStop,
        onNextSymbol,
        onNextWord,
        onResetCurrent,
    ] = useStart();
    const [statistics, onChangeMiss, onChangeWell] = useStatistic(isPlaying);

    const isSomeSymbols = React.useCallback(function isSomeSymbols(e) {
        return e.key === 'Shift' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Escape';
    }, []);

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
    const handleSuccessSymbol = React.useCallback(
        function handleSuccessSymbol() {
            onChangeWell();
            onNextSymbol();
        },
        [onNextSymbol, onChangeWell]
    );
    const handleMissSymbol = React.useCallback(() => {
        onChangeMiss();
        onResetCurrent();
    }, [onChangeMiss, onResetCurrent]);

    const handleSuccessWord = React.useCallback(
        function handleSuccessWord() {
            onChangeWell();
            onNextWord();
        },
        [onNextWord, onChangeWell]
    );

    const isSuccessSymbol = React.useCallback(
        function isSuccsessSymbol(e) {
            return currentSymbol.symbol === e.key;
        },
        [currentSymbol]
    );
    const isSuccessWord = React.useCallback(
        function isSuccsessWord() {
            return currentSymbol.count === currentWord.word.length;
        },
        [currentSymbol.count, currentWord.word]
    );

    function getWordActive(index) {
        if (currentWord.count === index) {
            return 'word_active';
        }
        if (currentWord.count > index) {
            return 'word_deactive';
        }
    }

    function getSumbitText() {
        if (!currentText) {
            return 'Начать игру';
        }
        if (isPlaying) {
            return 'Нажмите Esc для паузы';
        }
        return 'Продолжить';
    }

    const handleKey = React.useCallback(
        (e) => {
            if (e.key === 'Escape') {
                onStop();
                return;
            }
            if (isSomeSymbols(e)) {
                return;
            }
            if (e.key === ' ' && isSuccessWord()) {
                handleSuccessWord();
                return;
            }
            if (isSuccessSymbol(e)) {
                handleSuccessSymbol();
                return;
            }
            handleMissSymbol();
        },
        [
            isSomeSymbols,
            isSuccessSymbol,
            handleSuccessSymbol,
            isSuccessWord,
            handleSuccessWord,
            onStop,
            handleMissSymbol,
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

    // useEffect(() => {
    //     if (currentText) {
    //         setCurrentSymbol((prev) => ({
    //             ...prev,
    //             symbol: currentText[currentSymbol.count] === ' ' ? '_' : currentText[currentSymbol.count],
    //         }));
    //     }
    // }, [currentText, currentSymbol.count]);

    return (
        <div className='App'>
            <Header />
            <main className='content'>
                <div className='container'>
                    <button
                        disabled={isPlaying && true}
                        type='button'
                        onClick={onStart}
                        className={`button ${isPlaying && 'button_disabled'}`}
                    >
                        {getSumbitText()}
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
                        <p className='current'>{currentSymbol.symbol}</p>
                    </div>

                    <ul className='words-container'>
                        {currentText &&
                            currentText.split(' ').map((word, indexWord) => (
                                <Word isActive={getWordActive(indexWord)} key={indexWord}>
                                    {word.split('').map((letter, index) => (
                                        <Letter
                                            isActive={
                                                currentWord.count === indexWord && currentSymbol.count > index
                                            }
                                            key={index}
                                            letter={letter}
                                        />
                                    ))}
                                </Word>
                            ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default App;
