import {
  DIRECTIONS,
  getMoveTilesActions,
  applyAllActions,
  applyAction,
  reverseAction,
  reverseAllActions,
} from './BoardUtils'
import { evaluateBoard, getSearchDepth, getAllGenerateTileActions } from './AI'

self.addEventListener('message', e => {
  const { weights, boardState, searchDepth, id, parentDirection, newTileValue } = e.data

  let leaves = 0
  const inner = depth => {
    if (depth === 0) {
      leaves += 1
      const score = evaluateBoard(boardState, weights)
      return { score }
    }
    const options = []
    DIRECTIONS.forEach(direction => {
      const actions = getMoveTilesActions(direction, boardState)
      if (actions.length === 0) {
        options.push({ direction, score: 0 })
        return
      }
      applyAllActions(actions, boardState)
      const twoActions = getAllGenerateTileActions(boardState, 2)
      const twoScores = []
      const fourActions = getAllGenerateTileActions(boardState, 4)
      const fourScores = []
      twoActions.forEach(action => {
        applyAction(action, boardState)
        const nextMove = inner(depth - 1)
        reverseAction(action, boardState)
        twoScores.push(nextMove.score)
      })
      fourActions.forEach(action => {
        applyAction(action, boardState)
        const nextMove = inner(depth - 1)
        reverseAction(action, boardState)
        fourScores.push(nextMove.score)
      })
      reverseAllActions(actions, boardState)
      const averageTwoScore = twoScores.reduce((sum, score) => sum + score, 0) / twoScores.length
      const averageFourScore = fourScores.reduce((sum, score) => sum + score, 0) / fourScores.length
      options.push({ score: 0.9 * averageTwoScore + 0.1 * averageFourScore, direction })
    })
    options.sort((a, b) => b.score - a.score)
    return options[0]
  }

  const result = inner(searchDepth === undefined ? getSearchDepth(boardState) : searchDepth)
  self.postMessage({ id, parentDirection, newTileValue, leaves, ...result })
})
