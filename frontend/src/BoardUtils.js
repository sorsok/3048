import {
  chooseRandomEmptyTile,
  chooseTwoNumbersInRange,
  DOWN,
  getIndexTraversalOrder,
  getNextTileIndex,
  inSameRowOrColumn,
  LEFT,
  RIGHT,
  UP,
} from './utils'

export const MOVE = 'MOVE'
export const MERGE = 'MERGE'
export const GENERATE = 'GENERATE'

const createEmptyTiles = size => {
  const tiles = []
  for (let index = 0; index < size ** 2; index += 1) {
    tiles.push({ value: null, isEmpty: true })
  }

  return tiles
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
  const sum = allActions.reduce((sum, action) => sum + reverseAction(action, boardState), 0)
  allActions.reverse()
  return sum
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
    allActions = allActions.concat(actions)
    mergedIndices = mergedIndices.concat(newlyMergedIndices)
  }
  reverseAllActions(allActions, boardState)
  return allActions
}

export const isGameOver = boardState => {
  const directions = [UP, DOWN, RIGHT, LEFT]
  for (let direction of directions) {
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
