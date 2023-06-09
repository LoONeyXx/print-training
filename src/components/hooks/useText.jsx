import React from 'react';

export default function useText(text) {
    const [currentText, setCurrentText] = React.useState(text);

    function setStartText(array, count) {
        for (let i = 0; i < count; i++) {
            const random = Math.floor(Math.random() * (array.length - 1 - 0 + 1) + 0);
            setCurrentText((prev) => [...prev, array[random]]);
        }
    }

    return [currentText, setStartText, setCurrentText];
}
