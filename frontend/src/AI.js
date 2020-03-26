import { DOWN, LEFT, RIGHT, UP } from './utils'
import { getMoveTilesActions, MERGE, MOVE } from './BoardUtils'

export const pickNextMoveDirection = (boardState) => {
  return smarterAlgorithm(boardState)
}

const simpleAlgorithm = (boardState) => {
  let prevMove
  const inner = (boardState) => {
    const upActions = getMoveTilesActions(UP, boardState)
    if (upActions.length > 0 && prevMove !== LEFT) {
      prevMove = UP
      return UP
    }
    const leftActions = getMoveTilesActions(LEFT, boardState)
    if (leftActions.length > 0) {
      prevMove = LEFT
      return LEFT
    }
    const rightActions = getMoveTilesActions(RIGHT, boardState)
    if (rightActions.length > 0) {
      prevMove = RIGHT
      return RIGHT
    }
    const downActions = getMoveTilesActions(DOWN, boardState)
    if (downActions.length > 0) {
      prevMove = DOWN
      return DOWN
    }
  }
  return inner(boardState)
}

const getMergeFrequencies = (actions, boardState) => {
  const mergeActions = actions.filter((action) => action.type === MERGE)
  const mergeFrequencies = {}
  for (let action of mergeActions) {
    const tileValue = boardState[action.toIndex].value
    mergeFrequencies[tileValue] = mergeFrequencies[tileValue] ? mergeFrequencies[tileValue] + 1 : 1
  }
  return mergeFrequencies
}

const getMinMergeFrequency = (mergeFrequencies) => {
  if (Object.keys(mergeFrequencies).length === 0) return [Infinity, 0]
  return Object.entries(mergeFrequencies).sort((a, b) => (a[0] = b[0]))[0]
}

const smarterAlgorithm = (boardState) => {
  let options = [{ direction: UP }, { direction: LEFT }, { direction: RIGHT }, { direction: DOWN }]
  options = options.map((option) => ({
    actions: getMoveTilesActions(option.direction, boardState),
    ...option,
  }))
  let validOptions = options.filter((option) => option.actions.length > 0)
  validOptions = validOptions.map((option) => ({
    mergeFrequencies: getMergeFrequencies(option.actions, boardState),
    ...option,
  }))

  const maxValueOnBoard = boardState
    .filter((tile) => !tile.isEmpty)
    .reduce((maxValue, tile) => (tile.value > maxValue ? tile.value : maxValue), 0)

  // sort options so that option with the most low merges is first in the list
  // ensure maxValueTile doesn't move if possible
  validOptions.sort((a, b) => {
    const aMovesMaxValue = a.actions
      .filter((action) => action.type === MOVE)
      .map((action) => boardState[action.fromIndex].value)
      .some((value) => value === maxValueOnBoard)
    const bMovesMaxValue = b.actions
      .filter((action) => action.type === MOVE)
      .map((action) => boardState[action.fromIndex].value)
      .some((value) => value === maxValueOnBoard)
    if (aMovesMaxValue !== bMovesMaxValue) {
      return aMovesMaxValue ? 1 : -1
    }
    const aMinFrequency = getMinMergeFrequency(a.mergeFrequencies)
    const bMinFrequency = getMinMergeFrequency(b.mergeFrequencies)
    if (aMinFrequency[0] === bMinFrequency[0]) return aMinFrequency[1] - bMinFrequency[1]
    return aMinFrequency[0] - bMinFrequency[0]
  })
  return validOptions.length > 0 ? validOptions[0].direction : null
}
