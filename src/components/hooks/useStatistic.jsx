import { useEffect, useState } from 'react';

function useStatistic(isPlaying) {
    const [statistics, setStatistics] = useState({ well: 0, miss: 0, bpm: 0, accuracy: 0 });
    const [timer, setTimer] = useState(0);

    function onChangeMiss() {
        setStatistics((prev) => ({ ...prev, miss: prev.miss + 1 }));
    }
    function onChangeWell() {
        setStatistics((prev) => ({ ...prev, well: prev.well + 1 }));
    }

    useEffect(() => {
        setStatistics((prev) => ({ ...prev, bpm: (60 / timer) * prev.well }));
    }, [timer]);

    useEffect(() => {
        setStatistics((prev) => ({
            ...prev,
            accuracy: prev.well ? (prev.well * 100) / (prev.well + prev.miss) : 100,
        }));
    }, [statistics.miss, statistics.well]);

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

    return [statistics, onChangeMiss, onChangeWell];
}

export default useStatistic;
