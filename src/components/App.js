import './App.css';

let reader = new FileReader();
import Header from './Header';
import React, { useEffect } from 'react';
import Letter from './Letter';
import Word from './Word';
import useSymbol from './hooks/useSymbol';
import useWord from './hooks/useWord';
import useStatistic from './hooks/useStatistic';
import useText from './hooks/useText';
import { texts } from '../contexts/CurrentText';
import useBoolean from './hooks/useBoolean';
import useClass from './hooks/useClass';
import Statistics from './Statistics';
import Rules from './Rules';

function App() {
    const [file, setFile] = React.useState();
    const [text, setText] = React.useState('');
    const [wordCounter, setWordCounter] = React.useState(1);
    const [isPlaying, setPlaying] = React.useState(false);
    const [mode, setMode] = React.useState('');
    const [currentText, setStartText, setCurrentText] = useText([]);
    const { currentWord, setNextWord } = useWord(currentText);
    const { currentSymbol, setNextSymbol } = useSymbol(currentWord.word);
    const [statistics, resetStatistics, setSuccess, setMiss, getLevelAccuracy, getLevelBpm] =
        useStatistic(isPlaying);
    const [rules, setRules] = React.useState(false);
    const [leftWords, setLeftWords] = React.useState([]);
    const [isSuccsessSymbol, isSuccsessWord, isNoActionKey, isActiveSymbol, isButtonActive, isInputActive] =
        useBoolean(currentSymbol, currentWord, isPlaying, mode, rules);
    const [getSumbitText, getWordClass] = useClass(currentWord, leftWords, isPlaying, statistics);
    const [isWon, setWon] = React.useState(false);

    const SuccessSymbolAction = React.useCallback(() => {
        setNextSymbol(currentSymbol.count + 1);
        setSuccess(statistics.success + 1);
    }, [setSuccess, setNextSymbol]);

    const missSymbolAction = React.useCallback(() => {
        setNextSymbol(0);
        const successed = statistics.success - currentSymbol.count;
        setMiss(statistics.miss + 1);
        setSuccess(successed);
    }, [setSuccess, setMiss, setNextSymbol]);

    const SuccessWordAction = React.useCallback(() => {
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

    const handleStartButton = React.useCallback(() => {
        if (currentText.length > 0) {
            setPlaying(true);
        } else {
            newGame();
        }
    }, [setStartText, currentText]);

    const newGame = React.useCallback(() => {
        if (mode === 'custom') {
            setPlaying(true);
            setStartText(text.replace(/[\n\r]/g, '').split(' '));
            return;
        }
        setPlaying(true);
        setStartText(texts, wordCounter);
    }, [setStartText]);

    const isGameFinished = React.useCallback(
        (e) => {
            return isSuccsessWord(e) && leftWords.length === 1;
        },
        [leftWords.length, isSuccsessWord]
    );

    const resetGame = React.useCallback(() => {
        setWon(false);
        setStartText([]);
        setNextSymbol(0);
        setNextWord(0);
        resetStatistics();
        setMode('');
    }, [setStartText, setNextSymbol, setNextWord, resetStatistics]);

    const handleKey = React.useCallback(
        (e) => {
            e.preventDefault();
            if (isPlaying) {
                if (e.key === 'Escape') {
                    setPlaying(false);
                    return;
                }
                if (isNoActionKey(e)) {
                    return;
                }
                if (isGameFinished(e)) {
                    setWon(true);
                    setPlaying(false);
                    return;
                }
                if (isSuccsessWord(e)) {
                    SuccessWordAction();
                    return;
                }
                if (isSuccsessSymbol(e)) {
                    SuccessSymbolAction();
                    return;
                }

                missSymbolAction();
            }
            if (e.key === 'Enter') {
                setPlaying(true);
            }
        },

        [
            SuccessWordAction,
            leftWords.length,
            statistics,
            setMiss,
            isNoActionKey,
            isSuccsessWord,
            isSuccsessSymbol,
            currentSymbol.count,
            setNextSymbol,
            setSuccess,
        ]
    );

    const handleChangeCustomMode = React.useCallback((e) => {
        if (e.target.files[0] && e.target.files[0].name.slice(-3) === 'txt') {
            setFile(e.target.files);
            setMode(e.target.name);
            return;
        }
    }, []);
    const handleChangeMode = React.useCallback((e) => {
        setMode(e.target.value);
    }, []);

    useEffect(() => {
        if (file) {
            const newFile = file[0];
            reader.readAsText(newFile);
            reader.onload = () => setText(reader.result);
        } else setText('');
    }, [file]);

    useEffect(() => {
        setLeftWords(currentText.map((el, index) => index));
    }, [currentText]);

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
            <Header
                isActive={currentText.length === 0}
                onRules={setRules}
            />
            <main className='content'>
                <div className='container'>
                    <div className={`input  ${rules && 'input_rules'} ${currentWord.word && 'input_active'}`}>
                        {rules && 'function'}
                        {currentWord.word &&
                            currentWord.word.split('').map((letter, index) => (
                                <Letter
                                    key={index}
                                    letter={letter}
                                    isActive={isActiveSymbol(index)}
                                />
                            ))}
                        {rules && (
                            <Rules
                                rules={rules}
                                name='input'
                                title='Current word'
                            >
                                <ul className='rules__items'>
                                    <li className='rules__description'>shows the current word</li>
                                </ul>
                            </Rules>
                        )}
                    </div>

                    <button
                        disabled={!isButtonActive()}
                        type='button'
                        onClick={handleStartButton}
                        className={`button ${!isButtonActive() && 'button_disabled'}`}
                    >
                        {getSumbitText()}
                    </button>
                    <Statistics
                        name={'header'}
                        statistics={statistics}
                        getLevelAccuracy={getLevelAccuracy}
                        getLevelBpm={getLevelBpm}
                        isRules={rules}
                    >
                        {rules && (
                            <Rules
                                rules={rules}
                                name='statistic'
                                title='Statistics'
                            >
                                <ul className='rules__items'>
                                    <li className='rules__description'>
                                        Success (displays the number of successfully entered characters)
                                    </li>
                                    <li className='rules__description'>
                                        Miss (shows the number of erroneous inputs)
                                    </li>
                                    <li className='rules__description'>
                                        BPM (the number of successful inputs per minute is shown)
                                    </li>
                                    <li className='rules__description'>
                                        Accuracy ( shows the percentage of successful input and erroneous input)
                                    </li>
                                </ul>
                            </Rules>
                        )}
                    </Statistics>

                    {currentText.length > 0 && (
                        <ul className='words-container'>
                            {currentText.length > 0 &&
                                currentText.map((word, indexWord) => (
                                    <Word
                                        activeClass={getWordClass(indexWord)}
                                        key={indexWord}
                                    >
                                        {word.split('').map((letter, index) => (
                                            <Letter
                                                isActive={false}
                                                key={index}
                                                letter={letter}
                                            />
                                        ))}
                                    </Word>
                                ))}
                        </ul>
                    )}

                    <div className={`mode-group  ${rules && 'mode-group_rules'}`}>
                        <div className='modes'>
                            <label className={`mode__item ${mode === 'standart' && 'mode__item_active'}`}>
                                <input
                                    onClick={handleChangeMode}
                                    type='radio'
                                    name='standart'
                                    value='standart'
                                    className='real-radio-btn'
                                    disabled={!isInputActive()}
                                />
                                <span className='custom-radio-btn'></span>
                                Standart
                            </label>
                            <label className={`mode__item ${mode === 'random' && 'mode__item_active'}`}>
                                <input
                                    onClick={handleChangeMode}
                                    type='radio'
                                    name='random'
                                    value='random'
                                    className='real-radio-btn'
                                    disabled={!isInputActive()}
                                />
                                <span className='custom-radio-btn'></span>
                                Random
                            </label>
                            <label
                                className={`mode__item mode__item_file ${
                                    mode === 'custom' && 'mode__item_active'
                                }`}
                            >
                                <input
                                    type='file'
                                    name='custom'
                                    onChange={handleChangeCustomMode}
                                    className='file'
                                    disabled={!isInputActive()}
                                />
                                CUSTOM
                            </label>
                        </div>
                        <div className={`count-word ${mode !== 'custom' && 'count__word_visible'}`}>
                            <label className='count-word__label'>
                                {wordCounter}
                                <input
                                    type='range'
                                    name='number'
                                    step='1'
                                    min='1'
                                    max='100'
                                    value={wordCounter}
                                    onChange={(e) => setWordCounter(e.target.value)}
                                    className='count-word__input'
                                    disabled={!isInputActive()}
                                />
                            </label>
                        </div>
                        {rules && (
                            <Rules
                                title='Select the game mode'
                                name='mode'
                                rules={rules}
                            >
                                <ul className='rules__items'>
                                    <li className='rules__description'>
                                        Standart (the words will appear in the next sequence)
                                    </li>
                                    <li className='rules__description'>
                                        Random (the words will appear in a random sequence)
                                    </li>
                                    <li className='rules__description'>
                                        Custom (you can add your file in 'txt' format)
                                    </li>
                                </ul>
                                <h2 className='rules__item-title'>Select the number of words</h2>
                                <ul className='rules__items'>
                                    <li className='rules__description'>
                                        You can choose the number of words from 1 to 100
                                    </li>
                                </ul>
                            </Rules>
                        )}
                    </div>
                </div>
            </main>

            {isWon && (
                <div className='popup'>
                    <div className='popup__container'>
                        <h2 className='popup__title'>YOU WON</h2>
                        <p className='popup__subtitle'>RESULT</p>
                        <Statistics
                            statistics={statistics}
                            getLevelAccuracy={getLevelAccuracy}
                            getLevelBpm={getLevelBpm}
                            name={'popup'}
                        />
                        <button
                            onClick={resetGame}
                            className='popup__button'
                        >
                            TRY AGAIN
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

/**  <div className='rules'>
                    <h2 className='rules__title'>Instruction</h2>
                    <div className='stastistic-rules'>
                        <div className='statistic-rules__screen'></div>
                    </div>
                    <div className='start-rules'>
                        <div className='start-rules__screen'></div>
                    </div>
                    <div className='mode-rules'>
                        <div className='mode-rules__screen'></div>
                    </div>
                </div> */
