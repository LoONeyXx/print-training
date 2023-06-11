import { useEffect, useState } from 'react';

function useStatistic(isPlaying) {
    const [statistics, setStatistics] = useState({ success: 0, miss: 0, bpm: 0, accuracy: 0 });
    const [timer, setTimer] = useState(0);
    function resetStatistics() {
        setStatistics({ success: 0, miss: 0, bpm: 0, accuracy: 0 });
    }

    function setMiss(count) {
        setStatistics((prev) => ({ ...prev, miss: count }));
    }
    function setSuccess(count) {
        setStatistics((prev) => ({ ...prev, success: count }));
    }

    function getLevelAccuracy() {
        if (statistics.accuracy > 90) {
            return 'count_high';
        }
        if (statistics.accuracy > 80) {
            return 'count_medium';
        }

        return 'count_low';
    }

    function getLevelBpm() {
        if (statistics.bpm > 200) {
            return 'count_high';
        }
        if (statistics.bpm > 100 && statistics.bpm < 200) {
            return 'count_medium';
        }

        return 'count_low ';
    }

    useEffect(() => {
        setStatistics((prev) => ({ ...prev, bpm: (60 / timer) * prev.success }));
    }, [timer]);

    useEffect(() => {
        setStatistics((prev) => ({
            ...prev,
            accuracy: prev.success ? (prev.success * 100) / (prev.success + prev.miss) : 100,
        }));
    }, [statistics.miss, statistics.success]);

    useEffect(() => {
        let timerId = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);

        if (!isPlaying) {
            clearInterval(timerId);
        }

        return () => {
            clearInterval(timerId);
        };
    }, [isPlaying]);

    return [statistics, resetStatistics, setSuccess, setMiss, getLevelAccuracy, getLevelBpm];
}

export default useStatistic;
