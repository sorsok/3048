import {
  applyAction,
  applyAllActions,
  getEmptyTileCount,
  getGenerateTileAction,
  getMoveTilesActions,
  maxTileValue,
  reverseAction,
  reverseAllActions,
  DOWN,
  LEFT,
  RIGHT,
  UP,
  getAdjacentIndices,
  isCornerTile,
  deepCopyBoardState,
  DIRECTIONS,
} from './BoardUtils'
import { wrap } from 'comlink'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToggle, useWorker } from './utils'

// const simpleAlgorithm = boardState => {
//   let prevMove
//   const inner = boardState => {
//     const upActions = getMoveTilesActions(UP, boardState)
//     if (upActions.length > 0 && prevMove !== LEFT) {
//       prevMove = UP
//       return UP
//     }
//     const leftActions = getMoveTilesActions(LEFT, boardState)
//     if (leftActions.length > 0) {
//       prevMove = LEFT
//       return LEFT
//     }
//     const rightActions = getMoveTilesActions(RIGHT, boardState)
//     if (rightActions.length > 0) {
//       prevMove = RIGHT
//       return RIGHT
//     }
//     const downActions = getMoveTilesActions(DOWN, boardState)
//     if (downActions.length > 0) {
//       prevMove = DOWN
//       return DOWN
//     }
//   }
//   return inner(boardState)
// }

// const getActionMergeFrequencies = (actions, boardState) => {
//   const mergeActions = actions.filter(action => action.type === MERGE)
//   return mergeActions.reduce((acc, action) => {
//     const tileValue = boardState[action.toIndex].value
//     const mergeFrequencies = acc
//     mergeFrequencies[tileValue] = mergeFrequencies[tileValue] ? mergeFrequencies[tileValue] + 1 : 1
//     return mergeFrequencies
//   }, {})
// }
//
// const getMinMergeFrequency = mergeFrequencies => {
//   if (Object.keys(mergeFrequencies).length === 0) return [Infinity, 0]
//   return Object.entries(mergeFrequencies).sort((a, b) => a[0] - b[0])[0]
// }

// const mostLowMerges = (a, b) => {
//   const aMinFrequency = getMinMergeFrequency(a.mergeFrequencies)
//   const bMinFrequency = getMinMergeFrequency(b.mergeFrequencies)
//   if (aMinFrequency[0] === bMinFrequency[0]) return bMinFrequency[1] - aMinFrequency[1]
//   return aMinFrequency[0] - bMinFrequency[0]
// }

// const getMaxMergeFrequency = mergeFrequencies => {
//   if (Object.keys(mergeFrequencies).length === 0) return [0, 0]
//   return Object.entries(mergeFrequencies).sort((a, b) => b[0] - a[0])[0]
// }

// const mostHighMerges = (a, b) => {
//   const aMaxFrequency = getMaxMergeFrequency(a.mergeFrequencies)
//   const bMaxFrequency = getMaxMergeFrequency(b.mergeFrequencies)
//   if (aMaxFrequency[0] === bMaxFrequency[0]) return bMaxFrequency[1] - aMaxFrequency[1]
//   return bMaxFrequency[0] - aMaxFrequency[0]
// }

export const getBoardDensity = boardState => {
  const maxValue = maxTileValue(boardState)
  return (
    (boardState.reduce(
      (sum, tile) => (tile.isEmpty ? sum + maxValue ** 2 : sum + tile.value ** 2),
      0
    ) /
      boardState.length) **
    0.5
  )
}
//
// const getActionDensity = (actions, boardState) => {
//   applyAllActions(actions, boardState)
//   const averageValue = getBoardDensity(boardState)
//   reverseAllActions(actions, boardState)
//   return averageValue
// }

// const smarterAlgorithm = boardState => {
//   let options = [{ direction: UP }, { direction: LEFT }, { direction: RIGHT }, { direction: DOWN }]
//   const maxValueOnBoard = boardState
//     .filter(tile => !tile.isEmpty)
//     .reduce((maxValue, tile) => (tile.value > maxValue ? tile.value : maxValue), 0)
//   options = options
//     .map(option => {
//       const actions = getMoveTilesActions(option.direction, boardState)
//       if (actions.length === 0) {
//         return null
//       }
//       return {
//         density: getActionDensity(actions, boardState),
//         mergeFrequencies: getActionMergeFrequencies(actions, boardState),
//         movesMaxValue: actions
//           .filter(action => action.type === MOVE)
//           .map(action => boardState[action.fromIndex].value)
//           .some(value => value === maxValueOnBoard),
//         actions,
//         ...option,
//       }
//     })
//     .filter(option => option !== null)
//
//   options.sort((a, b) => {
//     if (a.movesMaxValue !== b.movesMaxValue) return a.movesMaxValue ? 1 : -1
//     return b.density - a.density
//   })
//   return options[0]
// }

const getEstimatedLeafCount = (boardState, searchDepth) => {
  let emptyTileCount = getEmptyTileCount(boardState)
  if (emptyTileCount < 5) {
    emptyTileCount = 0.125 * emptyTileCount ** 2 + 2
  }
  return (4 * 2 * emptyTileCount) ** searchDepth
}

export const getSearchDepth = boardState => {
  const TIME_PER_LEAF = 0.008
  const ALLOWED_TIME = 500
  for (let i = 2; i < 10; i++) {
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
  return i
}

export const getEdgeScore = boardState => {
  const size = boardState.length ** 0.5
  let top = 0
  let bottom = 0
  let left = 0
  let right = 0
  boardState.forEach((tile, index) => {
    if (!tile.isEmpty) {
      const inTop = index < size
      const inBottom = index > size ** 2 - size
      const inLeft = index % size === 0
      const inRight = index + (1 % size) === 0
      const value = tile.value ** 2
      if (inTop) top += value
      if (inBottom) bottom += value
      if (inLeft) left += value
      if (inRight) right += value
    }
  })
  const edges = [top, bottom, left, right]
  edges.sort((a, b) => b - a)
  return (edges[0] / size) ** 0.5
}

export const getCornerScore = boardState => {
  const size = boardState.length ** 0.5
  let maxValue = 0
  boardState.forEach((tile, index) => {
    if (isCornerTile(index, size)) {
      maxValue = tile.value > maxValue ? tile.value : maxValue
    }
  })
  // return (sumOfSquares / cornerCount) ** 0.5
  return maxValue ** 2
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
  return (sumOfSquares / (boardState.length * 2)) ** 0.5
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

export const getAllGenerateTileActions = (boardState, newValue) => {
  const generateTileActions = []
  boardState.forEach((tile, index) => {
    if (tile.isEmpty) {
      generateTileActions.push(getGenerateTileAction(index, newValue))
    }
  })
  return generateTileActions
}

export const lookaheadAlgorithm = (weights, boardState, searchDepth) => {
  let startTime = performance.now()
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

  const result = inner(searchDepth)
  let endTime = performance.now()
  let time = endTime - startTime
  console.log(
    'Search Depth: ',
    searchDepth,

    ', Boards Checked: ',
    leaves,
    ', Time Per 1000 Boards: ',
    (time / leaves) * 1000
  )
  return result
}

export const useLookaheadAlgorithm = (
  weights,
  boardState,
  runningAlgo,
  automatedMoveCount,
  gameOver
) => {
  const numWorkers = 100
  const [returnValue, setReturnValue] = useState(undefined)
  const [isCalculating, setIsCalculating] = useState(false)
  const move = useMemo(
    () => ({
      LEFT: {
        2: [],
        4: [],
      },
      RIGHT: {
        2: [],
        4: [],
      },
      UP: {
        2: [],
        4: [],
      },
      DOWN: {
        2: [],
        4: [],
      },
    }),
    []
  )
  const pendingChildren = useMemo(() => ({}), [])

  const workerOnmessage = useCallback(
    e => {
      const { id, parentDirection, newTileValue } = e.data
      delete pendingChildren[id]
      move[parentDirection][newTileValue].push(e.data)
      if (Object.keys(pendingChildren).length === 0) {
        const options = []
        DIRECTIONS.forEach(direction => {
          const averageTwoScore =
            move[direction][2].reduce((sum, move) => sum + move.score, 0) /
            move[direction][2].length
          const averageFourScore =
            move[direction][4].reduce((sum, move) => sum + move.score, 0) /
            move[direction][4].length
          options.push({ score: 0.9 * averageTwoScore + 0.1 * averageFourScore, direction })
        })
        options.sort((a, b) => b.score - a.score)
        setReturnValue(options[0])
        setIsCalculating(false)
        console.log('last child - calculating final score', JSON.parse(JSON.stringify(options[0])))
      }
    },
    [pendingChildren, move, setIsCalculating, setReturnValue]
  )

  const getWorkers = useCallback(
    num => {
      console.log('creating new workers')
      const workers = []
      for (let i = 0; i < num; i++) {
        const worker = new Worker('./AI.Worker', { type: 'module' })
        worker.onmessage = workerOnmessage
        workers.push(worker)
      }
      return workers
    },
    [workerOnmessage]
  )

  const workers = useMemo(() => getWorkers(numWorkers), [getWorkers])

  useEffect(() => {
    if (!runningAlgo || gameOver) {
      return
    }
    if (!isCalculating) {
      setIsCalculating(true)
      const searchDepth = getSearchDepth(boardState)
      console.log('search depth', searchDepth)
      let childrenCount = 0
      DIRECTIONS.forEach(direction => {
        const actions = getMoveTilesActions(direction, boardState)
        if (actions.length === 0) {
          return
        }
        applyAllActions(actions, boardState)
        const twoActions = getAllGenerateTileActions(boardState, 2)
        const fourActions = getAllGenerateTileActions(boardState, 4)
        twoActions.forEach((action, index) => {
          applyAction(action, boardState)
          const id = `${direction}-2-${index}`
          pendingChildren[id] = true
          workers[childrenCount % numWorkers].postMessage({
            weights,
            boardState,
            searchDepth,
            id,
            parentDirection: direction,
            newTileValue: 2,
            automatedMoveCount: automatedMoveCount + 1,
          })
          reverseAction(action, boardState)
          childrenCount += 1
        })
        fourActions.forEach((action, index) => {
          applyAction(action, boardState)
          const id = `${direction}-4-${index}`
          pendingChildren[id] = true
          workers[childrenCount % numWorkers].postMessage({
            weights,
            boardState,
            searchDepth,
            id,
            parentDirection: direction,
            newTileValue: 4,
            automatedMoveCount: automatedMoveCount + 1,
          })
          childrenCount += 1
          reverseAction(action, boardState)
        })
        console.log('children count', childrenCount)
        reverseAllActions(actions, boardState)
      })
    }
  }, [
    weights,
    boardState,
    runningAlgo,
    automatedMoveCount,
    workers,
    isCalculating,
    setIsCalculating,
    move,
    pendingChildren,
  ])

  return returnValue
}
