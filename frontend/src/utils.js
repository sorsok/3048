import {useCallback, useEffect, useState} from "react";

export const UP = 'UP'
export const DOWN = 'DOWN'
export const RIGHT = 'RIGHT'
export const LEFT = 'LEFT'

export const getIndexTraversalOrder = (direction, size) => {
    const indices = []
    if (direction === UP || direction === DOWN) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                indices.push(row * size + col)
            }
        }
    } else {
        for (let col = 0; col < size; col++) {
            for (let row = 0; row < size; row++) {
                indices.push(row * size + col)
            }
        }
    }
    if (direction === DOWN || direction === RIGHT) {
        indices.reverse()
    }
    return indices
}


export const getNextTileIndex = (tileIndex, direction, size) => {
    if (direction === UP) return tileIndex - size
    if (direction === DOWN) return tileIndex + size
    if (direction === RIGHT) return tileIndex + 1
    if (direction === LEFT) return tileIndex - 1
}


export const indexToCoordinates = (index, size) => {
    return [Math.floor(index / size), index % size]
}

export const inSameRowOrColumn = (index1, index2, size) => {
    const [row1, col1] = indexToCoordinates(index1, size)
    const [row2, col2] = indexToCoordinates(index2, size)
    return row1 === row2 || col1 === col2
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

export const chooseRandomEmptyTile = (boardState) => {
    const noEmpty = boardState.every(tile => !tile.isEmpty)
    if (noEmpty) {
        return -1
    }
    const stop = boardState.length
    const start = 0
    let position = Math.floor(Math.random() * (stop - start)) + start;
    let tile = boardState[position]
    while (!tile.isEmpty) {
        position = Math.floor(Math.random() * (stop - start)) + start;
        tile = boardState[position]
    }
    return position
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

export const useArrowKeys = (onKeyPress) => {
    const onKeyPressUp = () => onKeyPress(UP)
    useKeyPress('ArrowUp', onKeyPressUp)

    const onKeyPressDown = () => onKeyPress(DOWN)
    useKeyPress('ArrowDown', onKeyPressDown)

    const onKeyPressRight = () => onKeyPress(RIGHT)
    useKeyPress('ArrowRight', onKeyPressRight)

    const onKeyPressLeft = () => onKeyPress(LEFT)
    useKeyPress('ArrowLeft', onKeyPressLeft)
}