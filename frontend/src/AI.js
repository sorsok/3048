import {
  applyAction,
  applyAllActions,
  deepCopyBoardState,
  getGenerateTileAction,
  getMoveTilesActions,
  maxTileValue,
  MERGE,
  MOVE,
  reverseAction,
  reverseAllActions,
  DOWN,
  LEFT,
  RIGHT,
  UP,
  getAdjacentIndices,
  isCornerTile,
  isEdgeTile,
} from './BoardUtils.js'

const simpleAlgorithm = boardState => {
  let prevMove
  const inner = boardState => {
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
  const mergeActions = actions.filter(action => action.type === MERGE)
  return mergeActions.reduce((acc, action) => {
    const tileValue = boardState[action.toIndex].value
    const mergeFrequencies = acc
    mergeFrequencies[tileValue] = mergeFrequencies[tileValue] ? mergeFrequencies[tileValue] + 1 : 1
    return mergeFrequencies
  }, {})
}

const getMinMergeFrequency = mergeFrequencies => {
  if (Object.keys(mergeFrequencies).length === 0) return [Infinity, 0]
  return Object.entries(mergeFrequencies).sort((a, b) => a[0] - b[0])[0]
}

const mostLowMerges = (a, b) => {
  const aMinFrequency = getMinMergeFrequency(a.mergeFrequencies)
  const bMinFrequency = getMinMergeFrequency(b.mergeFrequencies)
  if (aMinFrequency[0] === bMinFrequency[0]) return bMinFrequency[1] - aMinFrequency[1]
  return aMinFrequency[0] - bMinFrequency[0]
}

const getMaxMergeFrequency = mergeFrequencies => {
  if (Object.keys(mergeFrequencies).length === 0) return [0, 0]
  return Object.entries(mergeFrequencies).sort((a, b) => b[0] - a[0])[0]
}

const mostHighMerges = (a, b) => {
  const aMaxFrequency = getMaxMergeFrequency(a.mergeFrequencies)
  const bMaxFrequency = getMaxMergeFrequency(b.mergeFrequencies)
  if (aMaxFrequency[0] === bMaxFrequency[0]) return bMaxFrequency[1] - aMaxFrequency[1]
  return bMaxFrequency[0] - aMaxFrequency[0]
}

export const getBoardDensity = boardState => {
  const nonEmptyTiles = boardState.filter(tile => !tile.isEmpty)
  const averageValue =
    nonEmptyTiles.reduce((sum, tile) => sum + tile.value, 0) / nonEmptyTiles.length
  // return averageValue

  const maxValue = maxTileValue(boardState)
  return (
    boardState.reduce((sum, tile) => (tile.isEmpty ? sum + maxValue : sum + tile.value), 0) /
    boardState.length
  )
}

const getActionDensity = (actions, boardState) => {
  applyAllActions(actions, boardState)
  const averageValue = getBoardDensity(boardState)
  reverseAllActions(actions, boardState)
  return averageValue
}

const smarterAlgorithm = boardState => {
  let options = [{ direction: UP }, { direction: LEFT }, { direction: RIGHT }, { direction: DOWN }]
  const maxValueOnBoard = boardState
    .filter(tile => !tile.isEmpty)
    .reduce((maxValue, tile) => (tile.value > maxValue ? tile.value : maxValue), 0)
  options = options
    .map(option => {
      const actions = getMoveTilesActions(option.direction, boardState)
      if (actions.length === 0) {
        return null
      }
      return {
        density: getActionDensity(actions, boardState),
        mergeFrequencies: getActionMergeFrequencies(actions, boardState),
        movesMaxValue: actions
          .filter(action => action.type === MOVE)
          .map(action => boardState[action.fromIndex].value)
          .some(value => value === maxValueOnBoard),
        actions,
        ...option,
      }
    })
    .filter(option => option !== null)

  options.sort((a, b) => {
    if (a.movesMaxValue !== b.movesMaxValue) return a.movesMaxValue ? 1 : -1
    return b.density - a.density
  })
  return options[0]
}

const getSearchDepth = (prevSearchDepth, prevLeafCount) => {
  return 2
  if (prevLeafCount < 70000 && prevLeafCount > 3000) {
    return prevSearchDepth
  }
  if (prevLeafCount < 3000) {
    return prevSearchDepth + 1
  }
  if (prevLeafCount > 70000) {
    return prevSearchDepth - 1
  }
  return 2
}

export const getEdgeScore = boardState => {
  const size = boardState.length ** 0.5
  const sumOfSquares = boardState
    .filter((tile, index) => isEdgeTile(index, size))
    .reduce((sum, tile) => sum + tile.value ** 2, 0)
  return (sumOfSquares / (size * 4)) ** 0.5
}

export const getCornerScore = boardState => {
  const size = boardState.length ** 0.5
  const sumOfSquares = boardState
    .filter((tile, index) => isCornerTile(index, size))
    .reduce((sum, tile) => sum + tile.value ** 2, 0)
  return (sumOfSquares / 4) ** 0.5
}

export const getBoardAdjacencyScore = boardState => {
  const size = boardState.length ** 0.5
  return (
    boardState
      .map((tile, index) => {
        let tileValue = 0
        if (!tile.isEmpty) {
          tileValue = tile.value
        }
        const adjacentIndices = getAdjacentIndices(index, size)
        return adjacentIndices
          .map(adjacentIndex => {
            let adjacentTileValue = 0
            const adjacentTile = boardState[adjacentIndex]
            if (!adjacentTile.isEmpty) {
              adjacentTileValue = adjacentTile.value
            }
            const difference = Math.abs(tileValue - adjacentTileValue)
            return difference ** 2
          })
          .reduce((sum, score) => sum + score, 0)
      })
      .reduce((sum, score) => sum + score, 0) **
      0.5 /
    -boardState.length
  )
}

export const getAdjacentEqualTileScore = boardState => {
  const size = boardState.length ** 0.5
  const sumOfSquares = boardState
    .map((tile, index) => {
      if (tile.isEmpty) {
        return 0
      }
      const adjacentIndices = getAdjacentIndices(index, size)
      return adjacentIndices
        .map(adjacentIndex => {
          const adjacentTile = boardState[adjacentIndex]
          if (adjacentTile.isEmpty) {
            return 0
          }
          const difference = Math.abs(tile.value - adjacentTile.value)
          return difference === 0 ? tile.value ** 2 : 0
        })
        .reduce((sum, score) => sum + score, 0)
    })
    .reduce((sum, score) => sum + score, 0)

  return (sumOfSquares / boardState.length) ** 0.5
}

export const evaluateBoard = (boardState, weights) => {
  const maxValueOnBoard = maxTileValue(boardState)
  const emptyTileCount = boardState.filter(tile => tile.isEmpty).length
  const scores = {
    density: getBoardDensity(boardState),
    adjacencyScore: getBoardAdjacencyScore(boardState),
    emptyTileCount,
    emptyTileFactor: maxValueOnBoard * Math.log(emptyTileCount),
    edgeScore: getEdgeScore(boardState),
    cornerScore: getCornerScore(boardState),
    adjacentEqualTileScore: getAdjacentEqualTileScore(boardState),
  }
  return Object.keys(weights).reduce((sum, metric) => scores[metric] * weights[metric], 0)
  // return emptyTileFactor + density * 1 + adjacencyScore * 0.1 + edgeScore * 0.1 + cornerScore * 2
  // return edgeScore * 2 + cornerScore * 2 + density + adjacentEqualTileScore * 2
  // return edgeScore * 2 + cornerScore * 3 + density + adjacentEqualTileScore * 2 // 2x2048
  // return edgeScore * 2 + cornerScore * 3 + density * 1 + adjacentEqualTileScore * 0
}

export const getAI = (weights) => {
  let prevSearchDepth = 1
  let prevLeafCount = 0
  const lookaheadAlgorithm = boardState => {
    let leaves = 0
    const state = deepCopyBoardState(boardState)
    const searchDepth = getSearchDepth(prevSearchDepth, prevLeafCount)
    const inner = depth => {
      if (depth === 0) {
        leaves += 1
        const score = evaluateBoard(state, weights)
        // console.log('Score: ', score, ', Board: ', deepCopyBoardState(state))
        return { score }
      }
      const options = [
        { direction: UP },
        { direction: LEFT },
        { direction: RIGHT },
        { direction: DOWN },
      ]
      let validOptions = options
        .map(option => {
          const actions = getMoveTilesActions(option.direction, state)
          if (actions.length === 0) {
            return null
          }
          return {
            actions,
            ...option,
          }
        })
        .filter(option => option !== null)
      if (validOptions.length === 0) {
        // we've reached a leaf with no possible moves
        return { score: -Infinity }
      }
      validOptions = validOptions.map(option => {
        applyAllActions(option.actions, state)
        const generateTileActionsTwo = state
          .map((tile, index) => {
            if (tile.isEmpty) {
              return getGenerateTileAction(index, 2)
            }
            return null
          })
          .filter(action => action !== null)
        const generateTileActionsFour = state
          .map((tile, index) => {
            if (tile.isEmpty) {
              return getGenerateTileAction(index, 4)
            }
            return null
          })
          .filter(action => action !== null)
        const averageScoreTwo = generateTileActionsTwo
          .map(action => {
            applyAction(action, state)
            const nextMove = inner(depth - 1)
            reverseAction(action, state)
            return nextMove.score
          })
          .reduce((sum, score) => sum + score, 0)
        const averageScoreFour = generateTileActionsFour
          .map(action => {
            applyAction(action, state)
            const nextMove = inner(depth - 1)
            reverseAction(action, state)
            return nextMove.score
          })
          .reduce((sum, score) => sum + score, 0)
        reverseAllActions(option.actions, state)
        return { score: 0.9 * averageScoreTwo + 0.1 * averageScoreFour, ...option }
      })
      validOptions.sort((a, b) => b.score - a.score)
      return validOptions[0]
    }

    const result = inner(searchDepth)
    prevSearchDepth = searchDepth
    prevLeafCount = leaves
    // console.log('Search Depth: ', searchDepth, ', Actual: ', leaves)
    return result
  }
  return lookaheadAlgorithm
}
