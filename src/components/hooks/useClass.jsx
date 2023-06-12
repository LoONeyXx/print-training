export default function useClass(currentWord, leftWords, isPlaying, statistics) {
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
            return 'Start game';
        }
        if (isPlaying) {
            return 'Press Esc for pause';
        }

        return 'Continue';
    }

    return [getSumbitText, getWordClass];
}
