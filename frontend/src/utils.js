import {useEffect, useState} from "react";

export const indexToCoordinates = (index, size) => {
    return [Math.floor(index / size), index % size]
}


export const chooseTwoNumbersInRange = (start, stop) => {
    if (stop - start < 2) {
        throw new Error("Range must be greater than 2")
    }
    const n1 = Math.floor(Math.random() * (stop - start)) + start;
    let n2 = Math.floor(Math.random() * (stop - start)) + start;
    while (n2 === n1) {
        n2 = Math.floor(Math.random() * (stop - start)) + start;
    }
    return [n1, n2]
}

export const useKeyPress = (targetKey, handler) => {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);

    // If pressed key is our target key then set to true
    const downHandler = ({key}) => {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }

    // If released key is our target key then set to false
    const upHandler = ({key}) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    if (keyPressed) handler()
    return keyPressed
}
