import React, { useCallback, useEffect, useState } from 'react'
import Board from './Board'
import { useArrowKeys, useToggle } from './utils'
import GameInfo from './GameInfo'
import GameControls from './GameControls'

import styles from './App.scss'

import {
  applyAllActions,
  createInitialBoardState,
  generateNewTile,
  getMoveTilesActions,
  isGameOver,
} from './BoardUtils'
import { useLookaheadAlgorithm } from './AI'

const App = () => {
  // App state
  const [size] = useState(4)
  const [gameOver, setGameOver] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [boardState, setBoardState] = useState(createInitialBoardState(size))
  const [score, setScore] = useState(0)
  const [runningAlgo, toggleAlgo] = useToggle(false)
  const [automatedMoveCount, setAutomatedMoveCount] = useState(0)
  const [moveHistory] = useState([{ score: 0 }])

  const weights = {
    // emptyTileFactor: 1,
    // density: 4,
    adjacencyScore: 1,
    // adjacentEqualTileScore: 10,
    // cornerScore: 1,
    // edgeScore: 1,
  }

  const nextMove = useLookaheadAlgorithm(
    weights,
    boardState,
    runningAlgo,
    automatedMoveCount,
    gameOver
  )

  const moveTiles = useCallback(
    direction => {
      const actions = getMoveTilesActions(direction, boardState)
      if (actions.length > 0) {
        setScore(score + applyAllActions(actions, boardState))
        setMoveCount(moveCount + 1)
        generateNewTile(boardState)
        setGameOver(isGameOver(boardState))
      } else {
        throw Error()
      }
    },
    [boardState, setMoveCount, moveCount, score]
  )

  useArrowKeys(moveTiles)

  useEffect(() => {
    if (nextMove) {
      moveHistory.push(nextMove)
      moveTiles(nextMove.direction)
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
        moveHistory={moveHistory}
      />
      <Board size={size} boardState={boardState} gameOver={gameOver} />
      <GameControls runningAlgo={runningAlgo} toggleAlgo={toggleAlgo} resetGame={resetGame} />
      {/* <button onClick={runSimulation}>Run Simulation </button> */}
    </div>
  )
}

export default App
