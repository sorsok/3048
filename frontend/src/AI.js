import {DOWN, LEFT, RIGHT, UP} from "./utils";
import {getMoveTilesActions} from "./BoardUtils";


export const pickNextMoveDirection = (boardState) => {
    return simpleAlgorithm(boardState)
}

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