import React, { useCallback, useEffect, useState } from 'react'
import Board from './Board'
import { useArrowKeys, useToggle } from './utils'
import GameInfo from './GameInfo'
import GameControls from './GameControls'

import styles from './App.module.css'
import {
  applyAllActions,
  createInitialBoardState,
  generateNewTile,
  getMoveTilesActions,
  isGameOver,
} from './BoardUtils'
import {getBoardAdjacencyScore, getBoardDensity, pickNextMoveDirection} from './AI'

const App = () => {
  // App state
  const [size, setSize] = useState(4)
  const [gameOver, setGameOver] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [boardState, setBoardState] = useState(createInitialBoardState(size))
  const [score, setScore] = useState(0)
  const [runningAlgo, toggleAlgo] = useToggle(false)
  const [automatedMoveCount, setAutomatedMoveCount] = useState(0)

  const moveTiles = useCallback(
    direction => {
      const actions = getMoveTilesActions(direction, boardState)
      if (actions.length > 0) {
        setScore(score + applyAllActions(actions, boardState))
        setMoveCount(moveCount + 1)
        generateNewTile(boardState)
        setGameOver(isGameOver(boardState))
      }
    },
    [boardState, setMoveCount, moveCount, score]
  )

  useArrowKeys(moveTiles)

  const resetGame = useCallback(() => {
    setBoardState(createInitialBoardState(size))
    setScore(0)
    setAutomatedMoveCount(0)
    setMoveCount(0)
    setGameOver(false)
    if (runningAlgo) toggleAlgo()
  }, [setBoardState, setScore, setAutomatedMoveCount, toggleAlgo, runningAlgo, size])

  const stepAlgo = useCallback(async () => {
    if (!runningAlgo || gameOver) return
    // await new Promise(resolve => setTimeout(resolve, 0.5))
    const nextDirection = pickNextMoveDirection(boardState)
    if (nextDirection) {
      moveTiles(nextDirection)
      setAutomatedMoveCount(automatedMoveCount + 1)
      if (moveCount % 10 === 0) {
        // toggleAlgo()
      }
      return
    }
    toggleAlgo()
  }, [
    boardState,
    moveTiles,
    toggleAlgo,
    runningAlgo,
    automatedMoveCount,
    setAutomatedMoveCount,
    gameOver,
    moveCount,
  ])

  const getStats = useCallback(() => {
    const density = getBoardDensity(boardState)
    const adjacencyScore = getBoardAdjacencyScore(boardState)
    return {
      adjacencyScore,
      density,
      total: density * 0.65 + adjacencyScore * 0.35,
    }
  }, [boardState])

  useEffect(() => {
    stepAlgo()
  }, [stepAlgo, moveCount, toggleAlgo])

  return (
    <div className={styles.container}>
      <GameInfo
        score={score}
        moveCount={moveCount}
        automatedMoveCount={automatedMoveCount}
        stats={getStats()}
      />
      <Board size={size} boardState={boardState} gameOver={gameOver} />
      <GameControls runningAlgo={runningAlgo} toggleAlgo={toggleAlgo} resetGame={resetGame} />
    </div>
  )
}

export default App
