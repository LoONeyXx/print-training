export default function useEventKey(currentSymbol, currentWord) {
    function isSuccsessSymbol(e) {
        return currentSymbol.symbol === e.key;
    }

    function isSuccsessWord(e) {
        return  currentSymbol.count === currentWord.word.length && e.key === ' ';
    }

    function isSomeSymbols(e) {
        return e.key === 'Shift' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Escape';
    }

    return [isSuccsessSymbol, isSuccsessWord, isSomeSymbols];
}
