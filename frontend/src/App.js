import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { hot } from 'react-hot-loader/root'
import Board from './Board'
import { useAlgo, useArrowKeys, useToggle } from './utils'
import GameInfo from './GameInfo'
import GameControls from './GameControls'

import styles from './App.scss'
console.log(styles)
import {
  applyAllActions,
  createInitialBoardState,
  generateNewTile,
  getMoveTilesActions,
  isGameOver,
} from './BoardUtils'


const App = () => {
  // App state
  const [size, setSize] = useState(4)
  const [gameOver, setGameOver] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [boardState, setBoardState] = useState(createInitialBoardState(size))
  const [score, setScore] = useState(0)
  const [runningAlgo, toggleAlgo] = useToggle(false)
  const [automatedMoveCount, setAutomatedMoveCount] = useState(0)

  const weights = {
    // emptyTileFactor: 1,
    density: 15,
    adjacentEqualTileScore: 0.1,
    cornerScore: 1.5,
    edgeScore: 1,
  }

  const nextMove = useAlgo(weights, boardState, runningAlgo, automatedMoveCount)

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

  useEffect(() => {
    if (nextMove) {
      const nextDirection = nextMove.direction
      moveTiles(nextDirection)
      setAutomatedMoveCount(automatedMoveCount + 1)
    }
  }, [nextMove])

  const resetGame = useCallback(() => {
    setBoardState(createInitialBoardState(size))
    setScore(0)
    setAutomatedMoveCount(0)
    setMoveCount(0)
    setGameOver(false)
    if (runningAlgo) toggleAlgo()
  }, [setBoardState, setScore, setAutomatedMoveCount, toggleAlgo, runningAlgo, size])

  return (
    <div className={styles.container}>
      <GameInfo
        score={score}
        moveCount={moveCount}
        automatedMoveCount={automatedMoveCount}
        // stats={getStats()}
      />
      <Board size={size} boardState={boardState} gameOver={gameOver} />
      <GameControls runningAlgo={runningAlgo} toggleAlgo={toggleAlgo} resetGame={resetGame} />
      {/*<button onClick={runSimulation}>Run Simulation </button>*/}
    </div>
  )
}

export default hot(App)
