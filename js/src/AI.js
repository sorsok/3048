import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  applyAction,
  applyAllActions,
  getEmptyTileCount,
  getGenerateTileAction,
  getMoveTilesActions,
  maxTileValue,
  reverseAction,
  reverseAllActions,
  getAdjacentIndices,
  isCornerTile,
  DIRECTIONS,
  isGameOver,
  getAdjacentTiles,
} from './BoardUtils'

const getBoardDensity = (boardState) => {
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

const getEstimatedLeafCount = (boardState, searchDepth, levelOneChildrenCount) => {
  const adjustedChildrenCount = (levelOneChildrenCount + 100 / searchDepth) / 2
  return Math.round(adjustedChildrenCount ** searchDepth)
}

export const getSearchDepth = (boardState, levelOneChildrenCount) => {
  const map = {
    0: 3,
    1: 3,
    2: 3,
    3: 2,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 1,
    9: 1,
    10: 1,
    11: 1,
    12: 1,
    13: 1,
    14: 1,
    15: 1,
  }
  const emptyTileCount = getEmptyTileCount(boardState)
  return [map[emptyTileCount], undefined, undefined]

  const MAX_DEPTH = 10
  const TIME_PER_LEAF = 0.001
  const ALLOWED_TIME = 1000
  for (let i = 2; i < MAX_DEPTH; i += 1) {
    const currentLeafCount = getEstimatedLeafCount(boardState, i, levelOneChildrenCount)
    const currentEstimate = currentLeafCount * TIME_PER_LEAF
    if (currentEstimate >= ALLOWED_TIME) {
      const prevLeafCount = getEstimatedLeafCount(boardState, i - 1, levelOneChildrenCount)
      const prevEstimate = currentLeafCount * TIME_PER_LEAF
      return [i - 2, prevLeafCount, prevEstimate]
    }
  }
  const leafCount = getEstimatedLeafCount(boardState, i, levelOneChildrenCount)
  return [MAX_DEPTH, leafCount, leafCount * TIME_PER_LEAF]
}

const getEdgeScore = (boardState) => {
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
      const inRight = (index + 1) % size === 0
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

const getCornerScore = (boardState) => {
  const size = boardState.length ** 0.5
  let maxValue = 0
  boardState.forEach((tile, index) => {
    if (isCornerTile(index, size)) {
      maxValue = tile.value > maxValue ? tile.value : maxValue
    }
  })
  return maxValue
}

const getBoardAdjacencyScore = (boardState, maxValueOnBoard) => {
  return (
    boardState
      .map((tile, index) => {
        let tileValue = 0
        if (!tile.isEmpty) {
          tileValue = tile.value
        }

        const adjacentTiles = getAdjacentTiles(boardState, index)
        return adjacentTiles
          .map((adjacentTile) => {
            let adjacentTileValue = 0
            if (adjacentTile && !adjacentTile.isEmpty) {
              adjacentTileValue = adjacentTile.value
            }
            const difference = Math.abs(tileValue - adjacentTileValue)
            return (maxValueOnBoard - difference) ** 2
          })
          .reduce((sum, score) => sum + score, 0)
      })
      .reduce((sum, score) => sum + score, 0) **
      0.5 /
    boardState.length
  )
}

const getAdjacentEqualTileScore = (boardState) => {
  const size = boardState.length ** 0.5
  let sumOfSquares = 0
  boardState.forEach((tile, index) => {
    if (!tile.isEmpty) {
      const adjacentIndices = getAdjacentIndices(index, size)
      adjacentIndices.forEach((adjacentIndex) => {
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
  return (sumOfSquares / boardState.length ** 2) ** 0.5
}

export const evaluateBoard = (boardState, weights) => {
  if (isGameOver(boardState)) return 0
  const maxValueOnBoard = maxTileValue(boardState)
  const emptyTileCount = getEmptyTileCount(boardState)
  const scores = {
    density: getBoardDensity(boardState),
    adjacencyScore: getBoardAdjacencyScore(boardState, maxValueOnBoard),
    emptyTileCount,
    emptyTileFactor: maxValueOnBoard * Math.log(emptyTileCount),
    edgeScore: getEdgeScore(boardState),
    cornerScore: getCornerScore(boardState),
    adjacentEqualTileScore: getAdjacentEqualTileScore(boardState),
    random: Math.random(),
  }
  return Object.keys(weights).reduce((sum, metric) => sum + scores[metric] * weights[metric], 0)
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
  const startTime = performance.now()
  let leaves = 0
  const inner = (depth) => {
    if (depth === 0) {
      leaves += 1
      const score = evaluateBoard(boardState, weights)
      return { score }
    }
    const options = []
    DIRECTIONS.forEach((direction) => {
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
      twoActions.forEach((action) => {
        applyAction(action, boardState)
        const nextMove = inner(depth - 1)
        reverseAction(action, boardState)
        twoScores.push(nextMove.score)
      })
      fourActions.forEach((action) => {
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
  const endTime = performance.now()
  const time = endTime - startTime
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

let estimate = 0

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
  const [startTime, setStartTime] = useState(performance.now())

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
    (e) => {
      const { id, parentDirection, newTileValue } = e.data
      delete pendingChildren[id]
      move[parentDirection][newTileValue].push(e.data)
      if (Object.keys(pendingChildren).length === 0) {
        const options = []
        let totalLeaves = 0
        DIRECTIONS.forEach((direction) => {
          if (move[direction][2].length === 0) {
            return
          }
          const averageTwoScore =
            move[direction][2].reduce((sum, child) => sum + child.score, 0) /
            move[direction][2].length
          totalLeaves += move[direction][2].reduce((sum, child) => sum + child.leaves, 0)
          move[direction][2] = []

          const averageFourScore =
            move[direction][4].reduce((sum, child) => sum + child.score, 0) /
            move[direction][4].length
          totalLeaves += move[direction][4].reduce((sum, child) => sum + child.leaves, 0)
          move[direction][4] = []

          options.push({ score: 0.9 * averageTwoScore + 0.1 * averageFourScore, direction })
        })
        options.sort((a, b) => b.score - a.score)

        setReturnValue(options[0])
        setIsCalculating(false)

        move.leaves = totalLeaves
      }
    },
    [pendingChildren, move, setIsCalculating, setReturnValue]
  )

  const getWorkers = useCallback(
    (num) => {
      console.log('creating new workers')
      const workers = []
      for (let i = 0; i < num; i += 1) {
        const worker = new Worker('worker.js')
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
      setStartTime(performance.now())
      setIsCalculating(true)
      let childrenCount = 0
      const directionActions = {}
      DIRECTIONS.forEach((direction) => {
        const actions = getMoveTilesActions(direction, boardState)
        if (actions.length === 0) {
          return
        }
        applyAllActions(actions, boardState)
        const twoActions = getAllGenerateTileActions(boardState, 2)
        const fourActions = getAllGenerateTileActions(boardState, 4)
        twoActions.forEach((action, index) => {
          const id = `${direction}-2-${index}`
          pendingChildren[id] = true
        })
        fourActions.forEach((action, index) => {
          const id = `${direction}-4-${index}`
          pendingChildren[id] = true
        })
        reverseAllActions(actions, boardState)
        directionActions[direction] = actions
      })
      const [searchDepth, leafEstimate, timeEstimate] = getSearchDepth(
        boardState,
        Object.keys(pendingChildren).length
      )
      console.log(
        'Search Depth:',
        searchDepth,
        'Level 1 Children Count',
        Object.keys(pendingChildren).length,
        'Estimated Boards Checked:',
        leafEstimate,
        'Estimated Time:',
        timeEstimate,
        'Estimated Time Per 1000 Boards',
        (timeEstimate / leafEstimate) * 1000
      )
      estimate = timeEstimate

      DIRECTIONS.forEach((direction) => {
        const actions = directionActions[direction]
        if (!actions) return
        applyAllActions(actions, boardState)
        const twoActions = getAllGenerateTileActions(boardState, 2)
        const fourActions = getAllGenerateTileActions(boardState, 4)
        twoActions.forEach((action, index) => {
          applyAction(action, boardState)
          const id = `${direction}-2-${index}`
          workers[childrenCount % numWorkers].postMessage({
            weights,
            boardState,
            searchDepth,
            id,
            parentDirection: direction,
            newTileValue: 2,
          })
          reverseAction(action, boardState)
          childrenCount += 1
        })
        fourActions.forEach((action, index) => {
          applyAction(action, boardState)
          const id = `${direction}-4-${index}`
          workers[childrenCount % numWorkers].postMessage({
            weights,
            boardState,
            searchDepth,
            id,
            parentDirection: direction,
            newTileValue: 4,
          })
          childrenCount += 1
          reverseAction(action, boardState)
        })
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

  useEffect(() => {
    if (!isCalculating) {
      const time = performance.now() - startTime
      console.log(
        'Actual Boards Checked:',
        move.leaves,
        'Actual Time',
        time,
        'Actual Time Per 1000 Boards:',
        (time / move.leaves) * 1000
      )
      console.log(`##-----Time Difference=${time - estimate}-----##`)
    }
  }, [isCalculating])

  return returnValue
}
