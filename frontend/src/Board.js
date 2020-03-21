import React, {useCallback, useState} from 'react'
import {
    chooseRandomEmptyTile,
    chooseTwoNumbersInRange, DOWN, getIndexTraversalOrder,
    getNextTileIndex,
    inSameRowOrColumn, LEFT, RIGHT, UP,
    useArrowKeys,
} from "./utils";
import Tile from "./Tile";
import Row from "./Row";

import styles from './Board.module.css'

const Board = ({size}) => {
    const createEmptyTiles = useCallback(() => {
        const tiles = []
        for (let index = 0; index < size ** 2; index++) {
            tiles.push({value: null, isEmpty: true})
        }

        return tiles
    }, [size])

    const createInitialBoardState = useCallback(() => {
        const allTiles = createEmptyTiles()
        const initialIndices = chooseTwoNumbersInRange(0, size ** 2)
        initialIndices.forEach(index => {
            allTiles[index] = {value: 2, isEmpty: false}
        })
        return allTiles
    }, [size, createEmptyTiles])

    const [boardState, setBoardState] = useState(createInitialBoardState())
    const [score, setScore] = useState(0)

    const renderRows = useCallback((boardState) => {
        const rows = []
        for (let rowNum = 0; rowNum < size; rowNum++) {
            const row = []
            for (let colNum = 0; colNum < size; colNum++) {
                const tile = boardState[rowNum * size + colNum]
                row.push(<Tile {...tile} />)
            }
            rows.push(<Row>{row}</Row>)
        }
        return rows
    }, [size])


    const pushTile = useCallback((direction, tileIndex, mergedIndices) => {
        let tileMoved = false
        const newlyMergedIndices = []
        let tile = boardState[tileIndex]
        if (!tile.isEmpty) {
            let nextTileIndex = getNextTileIndex(tileIndex, direction, size)
            let nextTile = boardState[nextTileIndex]
            while (nextTile && inSameRowOrColumn(tileIndex, nextTileIndex, size)) {
                if (nextTile.isEmpty) {
                    nextTile.value = tile.value
                    nextTile.isEmpty = false
                    tile.value = null
                    tile.isEmpty = true
                    tileMoved = true
                    tile = nextTile
                    tileIndex = nextTileIndex
                    nextTileIndex = getNextTileIndex(tileIndex, direction, size)
                    nextTile = boardState[nextTileIndex]
                } else if (nextTile.value === tile.value && !mergedIndices.includes(nextTileIndex)) {
                    nextTile.value = tile.value * 2
                    tile.value = null
                    tile.isEmpty = true
                    tileMoved = true
                    newlyMergedIndices.push(nextTileIndex)
                    setScore(score + nextTile.value)
                    break
                } else {
                    break
                }
            }
        }
        return [tileMoved, newlyMergedIndices]
    }, [boardState, size, score, setScore])

    const generateNewTile = useCallback(() => {
        const newTileIndex = chooseRandomEmptyTile(boardState)
        boardState[newTileIndex].value = Math.random() > 0.5 ? 4 : 2
        boardState[newTileIndex].isEmpty = false
    }, [boardState])

    const moveTiles = useCallback((direction) => {
        const tileIndices = getIndexTraversalOrder(direction, size)
        let tilesMoved = false
        let mergedIndices = []
        for (let tileIndex of tileIndices) {
            const [tileMoved, newlyMergedIndices] = pushTile(direction, tileIndex, mergedIndices)
            tilesMoved = tilesMoved || tileMoved
            mergedIndices = mergedIndices.concat(newlyMergedIndices)
        }
        if (tilesMoved) {
            generateNewTile()
        }
        return tilesMoved
    }, [size, pushTile, generateNewTile])

    useArrowKeys(moveTiles)

    const beginAlgo = useCallback(async () => {
        console.log("beginning algo")
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 100))
            if (moveTiles(UP)) continue
            if (moveTiles(LEFT)) continue
            if (moveTiles(RIGHT)) continue
            if (moveTiles(DOWN)) continue
            break
        }
        console.log("Game Over")
    }, [moveTiles])

    return (
        <div className={styles.container}>
            <div className={styles.score}>
                {`Score: ${score}`}
            </div>
            <div className={styles.rowsContainer}>
                {renderRows(boardState)}
            </div>
            <button className={styles.playForMe} onClick={beginAlgo}>
                Play For me
            </button>
        </div>
    )
}

export default Board