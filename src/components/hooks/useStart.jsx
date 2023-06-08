import { useEffect, useState } from 'react';
import { texts } from '../../contexts/CurrentText';
function useStart() {
    const [currentWord, setCurrentWord] = useState({ count: 0, word: '' });
    const [currentText, setCurrentText] = useState('');
    const [currentSymbol, setCurrentSymbol] = useState({ count: 0, symbol: '' });
    const [isPlaying, setPlaying] = useState(false);

    function onNextWord() {
        setCurrentWord((prev) => ({ count: prev.count + 1, word: currentText.split(' ')[prev.count + 1] }));
        setCurrentSymbol((prev) => ({ ...prev, count: 0 }));
    }

    function onNextSymbol() {
        setCurrentSymbol((prev) => ({ count: prev.count + 1, symbol: currentWord.word[prev.count + 1] }));
    }
    function onStart() {
        setPlaying(true);
    }

    function onStop() {
        setPlaying(false);
    }
    function onResetCurrent() {
        setCurrentSymbol((prev) => ({ ...prev, count: 0 }));
    }
    useEffect(() => {
        setCurrentWord((prev) => ({ ...prev, word: currentText.split(' ')[prev.count] }));
    }, [currentText]);

    useEffect(() => {
        setCurrentSymbol((prev) => ({ ...prev, symbol: currentWord.word[prev.count] }));
    }, [currentWord.word,currentSymbol.count]);

    useEffect(() => {
        if (!isPlaying || currentText.length >= 330) {
            return;
        }
        const random = Math.floor(Math.random() * (texts.length - 0 + 1) + 0);
        setCurrentText((prev) => `${prev} ${texts[random]}`.trim());
    }, [currentText, isPlaying]);

    return [
        currentSymbol,
        currentWord,
        currentText,
        isPlaying,
        onStart,
        onStop,
        onNextSymbol,
        onNextWord,
        onResetCurrent,
    ];
}

export default useStart;
