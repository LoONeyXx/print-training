import { useState, useEffect } from 'react';

export default function useWord(currentText = []) {
    const [currentWord, setCurrentWord] = useState({ count: 0, word: '' });

    function setNextWord(count) {
        setCurrentWord((prev) => ({ ...prev, count: count }));
    }
    useEffect(() => {
        setCurrentWord((prev) => ({ ...prev, word: currentText.length > 0 ? currentText[prev.count] : '' }));
    }, [currentText, currentWord.count]);

    return { currentWord, setNextWord };
}
