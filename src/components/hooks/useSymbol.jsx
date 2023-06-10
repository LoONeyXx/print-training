import { useEffect, useState } from 'react';

export default function useSymbol(word = '') {
    const [currentSymbol, setCurrentSymbol] = useState({ count: 0, symbol: '' });

    function setNextSymbol(count) {
        setCurrentSymbol((prev) => ({ ...prev, count: count }));
    }

    useEffect(() => {
        setCurrentSymbol((prev) => ({ ...prev, symbol: word[currentSymbol.count] }));
    }, [word, currentSymbol.count]);

    return { setNextSymbol, currentSymbol };
}
