export const MOVE = 'MOVE'
export const MERGE = 'MERGE'
export const GENERATE = 'GENERATE'

export const UP = 'UP'
export const DOWN = 'DOWN'
export const RIGHT = 'RIGHT'
export const LEFT = 'LEFT'
export const DIRECTIONS = [UP, DOWN, RIGHT, LEFT]

export const getIndexTraversalOrder = (direction, size) => {
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

export const getNextTileIndex = (tileIndex, direction, size) => {
  if (direction === UP) return tileIndex - size
  if (direction === DOWN) return tileIndex + size
  if (direction === RIGHT) return tileIndex + 1
  if (direction === LEFT) return tileIndex - 1
}

export const indexToCoordinates = (index, size) => {
  return [Math.floor(index / size), index % size]
}

export const inSameRowOrColumn = (index1, index2, size) => {
  const [row1, col1] = indexToCoordinates(index1, size)
  const [row2, col2] = indexToCoordinates(index2, size)
  return row1 === row2 || col1 === col2
}

export const chooseRandomEmptyTile = boardState => {
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

export const chooseTwoNumbersInRange = (start, stop) => {
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

export const createInitialBoardState = size => {
  const allTiles = createEmptyTiles(size)
  const initialIndices = chooseTwoNumbersInRange(0, size ** 2)
  initialIndices.forEach(index => {
    allTiles[index] = { value: 2, isEmpty: false }
  })
  return allTiles
}

export const reverseAction = (action, boardState) => {
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

export const applyAction = (action, boardState) => {
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

export const applyAllActions = (allActions, boardState) => {
  return allActions.reduce((sum, action) => sum + applyAction(action, boardState), 0)
}

export const reverseAllActions = (allActions, boardState) => {
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

export const getMoveTilesActions = (direction, boardState) => {
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

export const isGameOver = boardState => {
  for (let direction of DIRECTIONS) {
    const actions = getMoveTilesActions(direction, boardState)
    if (actions.length) return false
  }
  return true
}

export const getGenerateTileAction = (index, value) => {
  return {
    index,
    value,
    type: GENERATE,
  }
}

export const generateNewTile = boardState => {
  const value = Math.random() > 0.9 ? 4 : 2
  const index = chooseRandomEmptyTile(boardState)
  const action = getGenerateTileAction(index, value)
  applyAction(action, boardState)
}

export const deepCopyBoardState = boardState => {
  const deepCopy = []
  boardState.forEach(tile => {
    deepCopy.push({ ...tile })
  })
  return deepCopy
}

export const maxTileValue = boardState => {
  let maxValue = 0
  boardState.forEach(tile => {
    if (!tile.isEmpty) {
      maxValue = tile.value > maxValue ? tile.value : maxValue
    }
  })
  return maxValue
}

export const getAdjacentIndices = (index, size) => {
  const indices = [index - 1, index + 1, index + size, index - size]
  return indices.filter(idx => idx > 0 && idx < size ** 2)
}

export const isEdgeTile = (index, size) => {
  const inTop = index < size
  const inBottom = index > size ** 2 - size
  const inLeft = index % size === 0
  const inRight = index + (1 % size) === 0
  return inTop || inBottom || inLeft || inRight
}

export const isCornerTile = (index, size) => {
  return index === 0 || index === size - 1 || index === size ** 2 - 1 || index === size ** 2 - size
}

export const getEmptyTileCount = boardState => {
  let emptyTileCount = 0
  boardState.forEach(tile => {
    if (tile.isEmpty) emptyTileCount += 1
  })
  return emptyTileCount
}
