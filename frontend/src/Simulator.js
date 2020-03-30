import {
  applyAllActions,
  createInitialBoardState,
  generateNewTile,
  getMoveTilesActions,
  isGameOver,
  maxTileValue,
} from './BoardUtils.js'
import { getAI } from './AI.js'
import { WEIGHTS } from './Weights.js'
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'

process.setMaxListeners(20)

const moveTiles = (direction, boardState) => {
  const actions = getMoveTilesActions(direction, boardState)
  if (actions.length > 0) {
    const score = applyAllActions(actions, boardState)
    generateNewTile(boardState)
    return score
  }
  return 0
}

const simulateOneGame = weights => {
  const size = 4
  const boardState = createInitialBoardState(size)
  let score = 0
  let moveCount = 0
  const getNextMove = getAI(weights)
  while (!isGameOver(boardState)) {
    const nextDirection = getNextMove(boardState).direction
    if (nextDirection) {
      score += moveTiles(nextDirection, boardState)
      moveCount += 1
    }
  }
  const maxValue = maxTileValue(boardState)
  // console.log('Score: ', score)
  // console.log('Moves: ', moveCount)
  // console.log('Max Value: ', maxValue)
  return { score, moveCount, maxValue }
}

const testWeight = weight => {
  const scores = []
  const moveCounts = []
  const maxValues = []
  for (let i = 0; i < 30; i++) {
    const { score, moveCount, maxValue } = simulateOneGame(weight)
    scores.push(score)
    moveCounts.push(moveCount)
    maxValues.push(maxValue)
  }
  const meanScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
  const meanMoveCount = moveCounts.reduce((sum, score) => sum + score, 0) / moveCounts.length
  const meanMaxValue = maxValues.reduce((sum, score) => sum + score, 0) / maxValues.length

  const stdevScore =
    (scores.reduce((sum, score) => (score - meanScore) ** 2, 0) / scores.length) ** 0.5
  const stdevMoveCount =
    (moveCounts.reduce((sum, score) => (score - meanMoveCount) ** 2, 0) / moveCounts.length) ** 0.5
  const stdevMaxValue =
    (maxValues.reduce((sum, score) => (score - meanMaxValue) ** 2, 0) / maxValues.length) ** 0.5

  console.log(`Weight: ${JSON.stringify(weight)} Score: avg=${meanScore}, stdev=${stdevScore}`)
  console.log(
    `Weight: ${JSON.stringify(weight)} Moves: avg=${meanMoveCount}, stdev=${stdevMoveCount}`
  )
  console.log(
    `Weight: ${JSON.stringify(weight)} Max Value: avg=${meanMaxValue}, stdev=${stdevMaxValue}`
  )
}

export const runSimulation = () => {
  if (isMainThread) {
    WEIGHTS.map(
      weight =>
        new Worker('/Users/minasorsok/Documents/PycharmProjects/3048/frontend/src/Simulator.js', {
          workerData: { weight },
        })
    )
  } else {
    parentPort.postMessage(testWeight(workerData.weight))
  }
}

runSimulation()
