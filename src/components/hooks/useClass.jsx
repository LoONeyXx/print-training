export default function useClass(currentWord, leftWords, isPlaying) {
    function getWordClass(index) {
        if (currentWord.count === index) {
            return 'word_active';
        }
        if (!leftWords.some((el) => el === index)) {
            return 'word_deactive';
        }
    }

    function getSumbitText() {
        if (leftWords.length === 0) {
            return 'Начать игру';
        }
        if (isPlaying) {
            return 'Нажмите Esc для паузы';
        }

        return 'Продолжить';
    }

    return [getSumbitText, getWordClass];
}
