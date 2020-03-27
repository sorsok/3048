import { DOWN, LEFT, RIGHT, UP } from './utils'
import {
  applyAction,
  applyAllActions,
  getGenerateTileAction,
  getMoveTilesActions,
  MERGE,
  MOVE,
  reverseAction,
  reverseAllActions,
} from './BoardUtils'

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

const getActionMergeFrequencies = (actions, boardState) => {
  const mergeActions = actions.filter((action) => action.type === MERGE)
  return mergeActions.reduce((acc, action) => {
    const tileValue = boardState[action.toIndex].value
    const mergeFrequencies = acc
    mergeFrequencies[tileValue] = mergeFrequencies[tileValue] ? mergeFrequencies[tileValue] + 1 : 1
    return mergeFrequencies
  }, {})
}

const getMinMergeFrequency = (mergeFrequencies) => {
  if (Object.keys(mergeFrequencies).length === 0) return [Infinity, 0]
  return Object.entries(mergeFrequencies).sort((a, b) => a[0] - b[0])[0]
}

const mostLowMerges = (a, b) => {
  const aMinFrequency = getMinMergeFrequency(a.mergeFrequencies)
  const bMinFrequency = getMinMergeFrequency(b.mergeFrequencies)
  if (aMinFrequency[0] === bMinFrequency[0]) return bMinFrequency[1] - aMinFrequency[1]
  return aMinFrequency[0] - bMinFrequency[0]
}

const getMaxMergeFrequency = (mergeFrequencies) => {
  if (Object.keys(mergeFrequencies).length === 0) return [0, 0]
  return Object.entries(mergeFrequencies).sort((a, b) => b[0] - a[0])[0]
}

const mostHighMerges = (a, b) => {
  const aMaxFrequency = getMaxMergeFrequency(a.mergeFrequencies)
  const bMaxFrequency = getMaxMergeFrequency(b.mergeFrequencies)
  if (aMaxFrequency[0] === bMaxFrequency[0]) return bMaxFrequency[1] - aMaxFrequency[1]
  return bMaxFrequency[0] - aMaxFrequency[0]
}

const getBoardDensity = (boardState) => {
  const nonEmptyTiles = boardState.filter((tile) => !tile.isEmpty)
  return nonEmptyTiles.reduce((sum, tile) => sum + tile.value, 0) / nonEmptyTiles.length
}

const getActionDensity = (actions, boardState) => {
  applyAllActions(actions, boardState)
  const averageValue = getBoardDensity(boardState)
  reverseAllActions(actions, boardState)
  return averageValue
}

const smarterAlgorithm = (boardState) => {
  let options = [{ direction: UP }, { direction: LEFT }, { direction: RIGHT }, { direction: DOWN }]
  const maxValueOnBoard = boardState
    .filter((tile) => !tile.isEmpty)
    .reduce((maxValue, tile) => (tile.value > maxValue ? tile.value : maxValue), 0)
  options = options
    .map((option) => {
      const actions = getMoveTilesActions(option.direction, boardState)
      if (actions.length === 0) {
        return null
      }
      return {
        density: getActionDensity(actions, boardState),
        mergeFrequencies: getActionMergeFrequencies(actions, boardState),
        movesMaxValue: actions
          .filter((action) => action.type === MOVE)
          .map((action) => boardState[action.fromIndex].value)
          .some((value) => value === maxValueOnBoard),
        actions,
        ...option,
      }
    })
    .filter((option) => option !== null)

  options.sort((a, b) => {
    if (a.movesMaxValue !== b.movesMaxValue) return a.movesMaxValue ? 1 : -1
    return b.density - a.density
  })
  return options[0]
}

const lookaheadAlgorithm = (boardState) => {
  const inner = (depth) => {
    if (depth === 1) {
      return smarterAlgorithm(boardState)
    }
    let options = [
      { direction: UP },
      { direction: LEFT },
      { direction: RIGHT },
      { direction: DOWN },
    ]
    options = options
      .map((option) => {
        const actions = getMoveTilesActions(option.direction, boardState)
        if (actions.length === 0) {
          return null
        }
        return {
          actions,
          ...option,
        }
      })
      .filter((option) => option !== null)
      .map((option) => {
        applyAllActions(option.actions, boardState)
        const generateTileActionsTwo = boardState
          .map((tile, index) => {
            if (tile.isEmpty) {
              return getGenerateTileAction(index, 2)
            }
            return null
          })
          .filter((action) => action !== null)
        const generateTileActionsFour = boardState
          .map((tile, index) => {
            if (tile.isEmpty) {
              return getGenerateTileAction(index, 4)
            }
            return null
          })
          .filter((action) => action !== null)
        const generateTileActions = generateTileActionsTwo.concat(generateTileActionsFour)
        const averageDensity = generateTileActions
          .map((action) => {
            applyAction(action, boardState)
            const nextMove = inner(depth - 1)
            reverseAction(action, boardState)
            return nextMove ? nextMove.density : 0
          })
          .reduce((sum, density) => sum + density, 0)
        reverseAllActions(option.actions, boardState)
        return { density: averageDensity, ...option }
      })
    options.sort((a, b) => b.density - a.density)
    return options[0]
  }
  return inner(3)
}

export const pickNextMoveDirection = (boardState) => {
  return lookaheadAlgorithm(boardState).direction
}
