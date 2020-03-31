import {
  applyAllActions,
  DIRECTIONS,
  getAllGenerateTileActions,
  getMoveTilesActions,
} from './BoardUtils'

class SearchNode {
  constructor(boardState, actions, parent, depth, maxDepth) {
    this.boardState = boardState
    this.actions = actions
    this.parent = parent
    this.depth = depth
    this.maxDepth = maxDepth
    this.children = {}
    this.bestMove = null
  }

  generateChildren = () => {
    DIRECTIONS.forEach(direction => {
      this.children[direction] = []
      const directionActions = getMoveTilesActions(direction, this.boardState)
      if (directionActions.length === 0) {
        return
      }
      applyAllActions(directionActions, this.boardState)
      const twoActions = getAllGenerateTileActions(this.boardState, 2)
      const fourActions = getAllGenerateTileActions(this.boardState, 4)
      twoActions.forEach(action => {
        this.children.push(
          new SearchNode(this.boardState, [...directionActions, action], this, this.depth + 1)
        )
      })
      fourActions.forEach(action => {
        this.children.push(
          new SearchNode(this.boardState, [...directionActions, action], this, this.depth + 1)
        )
      })
    })
  }

  getBestMoveAndScore = () => {
    if (this.depth === this.maxDepth) {
    }
    for (const [direction, children] of Object.entries(this.children)) {
      const averageScore = children.reduce((sum, child) => {
        const [_, score] = child.getBestMoveAndScore()
      })
    }

    return [direction, score]
  }
}

export default SearchNode
