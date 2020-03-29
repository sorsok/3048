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
  console.log('Score: ', score)
  console.log('Moves: ', moveCount)
  console.log('Max Value: ', maxValue)
  return { score, moveCount, maxValue }
}

export const runSimulation = () => {
  WEIGHTS.map(weight => {
    let totalScore = 0
    let totalMoveCount = 0
    let totalMaxValue = 0
    console.log(JSON.stringify(weight))
    for (let i = 0; i < 5; i++) {
      console.log('Starting Game ', i + 1)
      const { score, moveCount, maxValue } = simulateOneGame(weight)
      totalScore += score
      totalMoveCount += moveCount
      totalMaxValue += maxValue
    }
    console.log('5 Games Simulated')
    console.log('Average Score: ', totalScore / 5)
    console.log('Average Moves: ', totalMoveCount / 5)
    console.log('Average Max Value: ', totalMaxValue / 5)
  })
}

runSimulation()
