import React from 'react';
import './Statistics.css';

function Statistics({ statistics, getLevelBpm, getLevelAccuracy, name, children, isRules }) {
    return (
        <div className={`statistic ${isRules && 'statistic_rules'} statistic_${name}`}>
            <p className={`statistic__count statistic__count_${name} statistic__count_success`}>
                Success
                <span className='current-count-number count_high'> {statistics.success}</span>
            </p>
            <p className={`statistic__count statistic__count_${name} statistic__count_miss`}>
                Miss<span className='miss-count-number count_low'> {statistics.miss}</span>
            </p>
            <p className={`statistic__count statistic__count_${name} statistic__count_bpm`}>
                BPM
                <span className={`bpm-count-number ${getLevelBpm()}`}>
                    {statistics.bpm ? statistics.bpm.toFixed(0) : 0}
                </span>
            </p>
            <p className={`statistic__count statistic__count_${name} statistic__count_accuracy`}>
                Accuracy
                <span className={`accuracy-count-number ${getLevelAccuracy()}`}>
                    {statistics.accuracy.toFixed(2)}%
                </span>
            </p>
            {children}
        </div>
    );
}
export default Statistics;
