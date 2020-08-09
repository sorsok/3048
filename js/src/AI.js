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

const rows = []

export const useLookaheadAlgorithm = (
  weights,
  boardState,
  runningAlgo,
  automatedMoveCount,
  gameOver
) => {
  const [returnValue, setReturnValue] = useState(undefined)
  const [isCalculating, setIsCalculating] = useState(false)
  const [startTime, setStartTime] = useState(performance.now())

  const workerOnmessage = useCallback(
    (e) => {
      setReturnValue(e.data)
      setIsCalculating(false)
    },
    [setIsCalculating, setReturnValue]
  )

  const worker = useMemo(() => {
    const wrkr = new Worker('worker.js')
    wrkr.onmessage = workerOnmessage
    return wrkr
  }, [])

  useEffect(() => {
    if (!runningAlgo || gameOver) {
      if (rows.length) {
        console.log('downloading csv')
        let csvContent = 'data:text/csv;charset=utf-8,'
        csvContent += 'leaves, time\n'
        csvContent += rows.map((e) => e.join(',')).join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `stats-${new Date().toString()}.csv`)
        document.body.appendChild(link)
        link.click()
      }
      return
    }
    if (!isCalculating) {
      setStartTime(performance.now())
      setIsCalculating(true)
      worker.postMessage({ boardState })
    }
  }, [weights, boardState, runningAlgo, automatedMoveCount, isCalculating, setIsCalculating])

  useEffect(() => {
    if (!isCalculating) {
      const time = performance.now() - startTime
      rows.push([time])
    }
  }, [isCalculating])

  return returnValue
}
