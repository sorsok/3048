import React, {useCallback, useEffect, useState} from 'react';
import Board from "./Board";
import {
    useArrowKeys,
    useToggle
} from "./utils";
import GameInfo from "./GameInfo";
import GameControls from "./GameControls";

import styles from './App.module.css'
import {applyAllActions, createInitialBoardState, generateNewTile, getMoveTilesActions, isGameOver} from "./BoardUtils";
import {pickNextMoveDirection} from "./AI";

const App = () => {
    // App state
    const [size, setSize] = useState(4)
    const [gameOver, setGameOver] = useState(false)
    const [moveCount, setMoveCount] = useState(0)
    const [boardState, setBoardState] = useState(createInitialBoardState(size))
    const [score, setScore] = useState(0)
    const [runningAlgo, toggleAlgo] = useToggle(false)
    const [automatedMoveCount, setAutomatedMoveCount] = useState(0)

    const moveTiles = useCallback((direction) => {
        const actions = getMoveTilesActions(direction, boardState)
        if (actions.length > 0) {
            setScore(score + applyAllActions(actions, boardState))
            setMoveCount(moveCount + 1)
            generateNewTile(boardState)
            setGameOver(isGameOver(boardState))
        }
    }, [boardState, setMoveCount, moveCount])

    useArrowKeys(moveTiles)


    const resetGame = useCallback(() => {
        setBoardState(createInitialBoardState(size))
        setScore(0)
        setAutomatedMoveCount(0)
        setMoveCount(0)
        setGameOver(false)
        if (runningAlgo) toggleAlgo()
    }, [setBoardState, createInitialBoardState, setScore, setAutomatedMoveCount, toggleAlgo])


    const stepAlgo = useCallback(async () => {
        if (!runningAlgo) return
        await new Promise(resolve => setTimeout(resolve, 100))
        const nextDirection = pickNextMoveDirection(boardState)
        if (nextDirection) {
            moveTiles(nextDirection)
            setAutomatedMoveCount(automatedMoveCount + 1)
            return
        }
        toggleAlgo()
    }, [moveTiles, toggleAlgo, runningAlgo, automatedMoveCount, setAutomatedMoveCount])


    useEffect(() => {
        stepAlgo()
    }, [stepAlgo])


    return (
        <div className={styles.container}>
            <GameInfo score={score} moveCount={moveCount} automatedMoveCount={automatedMoveCount}/>
            <Board size={4} boardState={boardState} gameOver={gameOver}/>
            <GameControls runningAlgo={runningAlgo} toggleAlgo={toggleAlgo} resetGame={resetGame}/>
        </div>
    )
}

export default App
