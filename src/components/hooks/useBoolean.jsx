import { useEffect } from 'react';

export default function useBoolean(currentSymbol, currentWord, isPlaying, mode, rules) {
    function isSuccsessSymbol(e) {
        return currentSymbol.symbol === e.key;
    }

    function isSuccsessWord(e) {
        return currentSymbol.count === currentWord.word.length && e.key === ' ';
    }

    function isNoActionKey(e) {
        return e.key === 'Shift' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Escape';
    }
    function isActiveSymbol(index) {
        return currentSymbol.count > index;
    }

    function isButtonActive() {
        return !isPlaying && mode !== '' && !rules;
    }
    function isInputActive() {
        return currentWord.word === '';
    }

    return [isSuccsessSymbol, isSuccsessWord, isNoActionKey, isActiveSymbol, isButtonActive, isInputActive];
}
