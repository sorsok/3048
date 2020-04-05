const MOVE = 'MOVE'
const MERGE = 'MERGE'
const GENERATE = 'GENERATE'

const UP = 'UP'
const DOWN = 'DOWN'
const RIGHT = 'RIGHT'
const LEFT = 'LEFT'

const getIndexTraversalOrder = (direction, size) => {
  const indices = []
  if (direction === UP || direction === DOWN) {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        indices.push(row * size + col)
      }
    }
  } else {
    for (let col = 0; col < size; col += 1) {
      for (let row = 0; row < size; row += 1) {
        indices.push(row * size + col)
      }
    }
  }
  if (direction === DOWN || direction === RIGHT) {
    indices.reverse()
  }
  return indices
}

const createEmptyTiles = size => {
  const tiles = []
  for (let index = 0; index < size ** 2; index += 1) {
    tiles.push({ value: null, isEmpty: true })
  }

  return tiles
}

const getNextTileIndex = (tileIndex, direction, size) => {
  if (direction === UP) return tileIndex - size
  if (direction === DOWN) return tileIndex + size
  if (direction === RIGHT) return tileIndex + 1
  if (direction === LEFT) return tileIndex - 1
}

const indexToCoordinates = (index, size) => {
  return [Math.floor(index / size), index % size]
}

const inSameRowOrColumn = (index1, index2, size) => {
  const [row1, col1] = indexToCoordinates(index1, size)
  const [row2, col2] = indexToCoordinates(index2, size)
  return row1 === row2 || col1 === col2
}

const chooseRandomEmptyTile = boardState => {
  const noEmpty = boardState.every(tile => !tile.isEmpty)
  if (noEmpty) {
    return -1
  }
  const stop = boardState.length
  const start = 0
  let position = Math.floor(Math.random() * (stop - start)) + start
  let tile = boardState[position]
  while (!tile.isEmpty) {
    position = Math.floor(Math.random() * (stop - start)) + start
    tile = boardState[position]
  }
  return position
}

const chooseTwoNumbersInRange = (start, stop) => {
  if (stop - start < 2) {
    throw new Error('Range must be greater than 2')
  }
  const n1 = Math.floor(Math.random() * (stop - start)) + start
  let n2 = Math.floor(Math.random() * (stop - start)) + start
  while (n2 === n1) {
    n2 = Math.floor(Math.random() * (stop - start)) + start
  }
  return [n1, n2]
}

const reverseAction = (action, boardState) => {
  let pointsAdded = 0
  if (action.type === MOVE) {
    const from = boardState[action.fromIndex]
    const to = boardState[action.toIndex]
    from.value = to.value
    to.isEmpty = true
    to.value = null
    from.isEmpty = false
  } else if (action.type === MERGE) {
    const from = boardState[action.fromIndex]
    const to = boardState[action.toIndex]
    pointsAdded -= to.value
    from.value = to.value / 2
    to.value = from.value
    from.isEmpty = false
  } else if (action.type === GENERATE) {
    const tile = boardState[action.index]
    tile.value = null
    tile.isEmpty = true
  }
  return pointsAdded
}

const applyAction = (action, boardState) => {
  let pointsAdded = 0
  if (action.type === MOVE) {
    const from = boardState[action.fromIndex]
    const to = boardState[action.toIndex]
    to.value = from.value
    to.isEmpty = false
    from.value = null
    from.isEmpty = true
  } else if (action.type === MERGE) {
    const from = boardState[action.fromIndex]
    const to = boardState[action.toIndex]
    to.value = from.value * 2
    from.value = null
    from.isEmpty = true
    pointsAdded += to.value
  } else if (action.type === GENERATE) {
    const tile = boardState[action.index]
    tile.value = action.value
    tile.isEmpty = false
  }

  return pointsAdded
}

const applyAllActions = (allActions, boardState) => {
  return allActions.reduce((sum, action) => sum + applyAction(action, boardState), 0)
}

const reverseAllActions = (allActions, boardState) => {
  allActions.reverse()
  const score = allActions.reduce((sum, action) => sum + reverseAction(action, boardState), 0)
  allActions.reverse()
  return score
}

const getAndApplyPushTileActions = (direction, tileIndex, mergedIndices, boardState) => {
  const actions = []
  const newlyMergedIndices = []
  let tile = boardState[tileIndex]
  const size = boardState.length ** 0.5

  if (!tile.isEmpty) {
    let nextTileIndex = getNextTileIndex(tileIndex, direction, size)
    let nextTile = boardState[nextTileIndex]
    while (nextTile && inSameRowOrColumn(tileIndex, nextTileIndex, size)) {
      if (nextTile.isEmpty) {
        const action = {
          type: MOVE,
          fromIndex: tileIndex,
          toIndex: nextTileIndex,
        }
        applyAction(action, boardState)
        actions.push(action)
        tile = nextTile
        tileIndex = nextTileIndex
        nextTileIndex = getNextTileIndex(tileIndex, direction, size)
        nextTile = boardState[nextTileIndex]
      } else if (nextTile.value === tile.value && !mergedIndices.includes(nextTileIndex)) {
        const action = {
          type: MERGE,
          fromIndex: tileIndex,
          toIndex: nextTileIndex,
        }
        applyAction(action, boardState)
        actions.push(action)
        break
      } else {
        break
      }
    }
  }
  return [actions, newlyMergedIndices]
}

const getMoveTilesActions = (direction, boardState) => {
  const size = boardState.length ** 0.5
  const tileIndices = getIndexTraversalOrder(direction, size)
  let allActions = []
  let mergedIndices = []
  for (let tileIndex of tileIndices) {
    const [actions, newlyMergedIndices] = getAndApplyPushTileActions(
      direction,
      tileIndex,
      mergedIndices,
      boardState
    )
    allActions.push(...actions)
    mergedIndices.push(...newlyMergedIndices)
  }
  reverseAllActions(allActions, boardState)
  return allActions
}

const getGenerateTileAction = (index, value) => {
  return {
    index,
    value,
    type: GENERATE,
  }
}

const maxTileValue = boardState => {
  let maxValue = 0
  boardState.forEach(tile => {
    if (!tile.isEmpty) {
      maxValue = tile.value > maxValue ? tile.value : maxValue
    }
  })
  return maxValue
}

const getAdjacentIndices = (index, size) => {
  const indices = [index - 1, index + 1, index + size, index - size]
  return indices.filter(idx => idx > 0 && idx < size ** 2)
}

const isCornerTile = (index, size) => {
  return index === 0 || index === size - 1 || index === size ** 2 - 1 || index === size ** 2 - size
}

const getEmptyTileCount = boardState => {
  let emptyTileCount = 0
  boardState.forEach(tile => {
    if (tile.isEmpty) emptyTileCount += 1
  })
  return emptyTileCount
}

const getBoardDensity = boardState => {
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

const getEstimatedLeafCount = (boardState, searchDepth) => {
  let emptyTileCount = getEmptyTileCount(boardState)
  if (emptyTileCount < 5) {
    emptyTileCount = 0.125 * emptyTileCount ** 2 + 2
  }
  return (4 * 2 * emptyTileCount) ** searchDepth
}

const getSearchDepth = boardState => {
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

const getEdgeScore = boardState => {
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

const getCornerScore = boardState => {
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

const getBoardAdjacencyScore = boardState => {
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

const getAdjacentEqualTileScore = boardState => {
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

const evaluateBoard = (boardState, weights) => {
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
const DIRECTIONS = [UP, DOWN, RIGHT, LEFT]

/////////////////////////////////

// const childrenMoves = {
//   LEFT: {
//     2: [],
//     4: [],
//   },
//   RIGHT: {
//     2: [],
//     4: [],
//   },
//   UP: {
//     2: [],
//     4: [],
//   },
//   DOWN: {
//     2: [],
//     4: [],
//   },
// }
//
// const pendingChildren = {}

const getChildOnmessage = (id, direction, num) => {
  return e => {
    delete pendingChildren[id]
    childrenMoves[direction][num].push(e.data)
    if (Object.keys(pendingChildren).length === 0) {
      const options = []
      DIRECTIONS.forEach(direction => {
        const averageTwoScore =
          childrenMoves[direction][2].reduce((sum, move) => sum + move.score, 0) /
          childrenMoves[direction][2].length
        const averageFourScore =
          childrenMoves[direction][4].reduce((sum, move) => sum + move.score, 0) /
          childrenMoves[direction][4].length
        options.push({ score: 0.9 * averageTwoScore + 0.1 * averageFourScore, direction })
      })
      options.sort((a, b) => b.score - a.score)
      postMessage(options[0])
    }
  }
}

onmessage = e => {
  let { weights, boardState, searchDepth, id, parentDirection, newTileValue } = e.data
  if (searchDepth === undefined) {
    searchDepth = getSearchDepth(boardState)
  }

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
  postMessage({ id, parentDirection, newTileValue, ...result })
}
