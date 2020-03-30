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
import { getEmptyTileCount } from './BoardUtils'

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

const getEstimatedLeafCount = (boardState, searchDepth) => {
  let emptyTileCount = getEmptyTileCount(boardState)
  if (emptyTileCount < 1) {
    emptyTileCount = 1
  }
  return (4 * 2 * emptyTileCount) ** searchDepth
}

const getSearchDepth = boardState => {
  // return 2
  const TIME_PER_LEAF = 0.01
  const ALLOWED_TIME = 200
  for (let i = 2; i < 5; i++) {
    const currentLeafCount = getEstimatedLeafCount(boardState, i)
    const currentEstimate = currentLeafCount * TIME_PER_LEAF
    if (currentEstimate < ALLOWED_TIME) continue
    const prevLeafCount = getEstimatedLeafCount(boardState, i - 1)
    const prevEstimate = prevLeafCount * TIME_PER_LEAF
    if (currentEstimate - ALLOWED_TIME > ALLOWED_TIME - prevEstimate) {
      return i - 1
    }
    return i
  }
}

export const getEdgeScore = boardState => {
  const size = boardState.length ** 0.5
  let sumOfSquares = 0
  let edgeCount = 0
  boardState.forEach((tile, index) => {
    if (isEdgeTile(index, size)) {
      sumOfSquares += tile.value ** 2
      edgeCount += 1
    }
  })
  return (sumOfSquares / edgeCount) ** 0.5
}

export const getCornerScore = boardState => {
  const size = boardState.length ** 0.5
  let sumOfSquares = 0
  let cornerCount = 0
  boardState.forEach((tile, index) => {
    if (isCornerTile(index, size)) {
      sumOfSquares += tile.value ** 2
      cornerCount += 1
    }
  })
  return (sumOfSquares / cornerCount) ** 0.5
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
  let sumOfSquares = 0
  boardState.forEach((tile, index) => {
    if (!tile.isEmpty) {
      const adjacentIndices = getAdjacentIndices(index, size)
      adjacentIndices.forEach(adjacentIndex => {
        const adjacentTile = boardState[adjacentIndex]
        if (!adjacentTile.isEmpty) {
          const difference = Math.abs(tile.value - adjacentTile.value)
          if (difference === 0) {
            sumOfSquares += tile.value ** 2
          }
        }
      })
    }
  })
  return (sumOfSquares / boardState.length) ** 0.5
}

export const evaluateBoard = (boardState, weights) => {
  const maxValueOnBoard = maxTileValue(boardState)
  const emptyTileCount = getEmptyTileCount(boardState)
  const scores = {
    density: getBoardDensity(boardState),
    adjacencyScore: getBoardAdjacencyScore(boardState),
    emptyTileCount,
    emptyTileFactor: maxValueOnBoard * Math.log(emptyTileCount),
    edgeScore: getEdgeScore(boardState),
    cornerScore: getCornerScore(boardState),
    adjacentEqualTileScore: getAdjacentEqualTileScore(boardState),
    random: Math.random(),
  }
  return Object.keys(weights).reduce((sum, metric) => scores[metric] * weights[metric], 0)
}

const getAllGenerateTileActions = (boardState, newValue) => {
  const generateTileActions = []
  boardState.forEach((tile, index) => {
    if (tile.isEmpty) {
      generateTileActions.push(getGenerateTileAction(index, newValue))
    }
  })
  return generateTileActions
}

export const getAI = weights => {
  const lookaheadAlgorithm = boardState => {
    const startTime = performance.now()
    const probabilities = { 2: 0.9, 4: 0.1 }
    let leaves = 0
    const initialSearchDepth = getSearchDepth(boardState)
    const directions = [UP, LEFT, RIGHT, DOWN]
    const validOptions = []
    const queue = [
      {
        actions: [],
        direction: null,
        searchDepth: initialSearchDepth,
        parentNode: null,
        generatedValue: 1,
      },
    ]
    while (queue.length > 0) {
      const currentNode = queue.pop()
      const { actions, searchDepth, parentNode, generatedValue } = currentNode
      const allActions = actions.slice()
      let tempNode = parentNode
      while (tempNode) {
        allActions.unshift(...tempNode.actions)
        tempNode = tempNode.parentNode
      }
      applyAllActions(allActions, boardState)
      if (searchDepth === 0 && generatedValue) {
        //bubble up scores
        leaves += 1
        const weightedScore = evaluateBoard(boardState, weights) * probabilities[generatedValue]
        let parentOption = parentNode
        while (parentOption.searchDepth !== initialSearchDepth || parentOption.generatedValue) {
          parentOption = parentOption.parentNode
        }
        parentOption.childScores += weightedScore
        parentOption.childrenCount += 1
      } else if (generatedValue) {
        // generate directions
        directions.forEach(nextDirection => {
          const newActions = getMoveTilesActions(nextDirection, boardState)
          if (newActions.length === 0) {
            return
          }
          const newNode = {
            actions: newActions,
            direction: nextDirection,
            searchDepth,
            parentNode: currentNode,
            generatedValue: null,
            childScores: 0,
            childrenCount: 0,
          }
          queue.push(newNode)
          if (searchDepth === initialSearchDepth) {
            validOptions.push(newNode)
          }
        })
      } else {
        //generate 2s and 4s
        const twoActions = getAllGenerateTileActions(boardState, 2)
        const fourActions = getAllGenerateTileActions(boardState, 4)
        twoActions.forEach(action => {
          queue.push({
            actions: [action],
            searchDepth: searchDepth - 1,
            parentNode: currentNode,
            generatedValue: 2,
          })
        })
        fourActions.forEach(action => {
          queue.push({
            actions: [action],
            searchDepth: searchDepth - 1,
            parentNode: currentNode,
            generatedValue: 2,
          })
        })
      }
      reverseAllActions(allActions, boardState)
    }
    validOptions.forEach(option => {
      option.score = option.childScores / option.childrenCount
    })

    validOptions.sort((a, b) => b.score - a.score)
    const endTime = performance.now()
    console.log(
      'Search Depth: ',
      initialSearchDepth,
      ', Boards Checked: ',
      leaves,
      ', Performance Time',
      endTime - startTime,
      ', Time Per 1000 Boards',
      ((endTime - startTime) / leaves) * 1000
    )
    return validOptions[0]
  }
  return lookaheadAlgorithm
}
