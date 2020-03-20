import React, {useCallback, useState} from 'react'
import {
    chooseRandomEmptyTile,
    chooseTwoNumbersInRange, getIndexTraversalOrder,
    getNextTileIndex,
    indexToCoordinates,
    inSameRowOrColumn,
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
    }, [size])

    const [boardState, setBoardState] = useState(createInitialBoardState())


    const renderRows = useCallback((boardState) => {
        const rows = []
        for (let rowNum = 0; rowNum < size; rowNum++) {
            const row = []
            for (let colNum = 0; colNum < size; colNum++) {
                const tile = boardState[rowNum * size + colNum]
                row.push(<Tile {...tile} />)
            }
            rows.push(
                <Row>
                    {row}
                </Row>
            )
        }
        return rows
    }, [createEmptyTiles])


    const pushTile = useCallback((direction, tileIndex) => {
        let tilePushed = false
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
                    tilePushed = true
                } else if (nextTile.value === tile.value) {
                    nextTile.value = tile.value * 2
                    tile.value = null
                    tile.isEmpty = true
                    tilePushed = true
                } else {
                    break
                }
                tile = nextTile
                tileIndex = nextTileIndex
                nextTileIndex = getNextTileIndex(tileIndex, direction, size)
                nextTile = boardState[nextTileIndex]
            }
        }
        return tilePushed
    }, [indexToCoordinates, boardState, setBoardState, size])

    const generateNewTile = useCallback(() => {
        const newTileIndex = chooseRandomEmptyTile(boardState)
        boardState[newTileIndex].value = Math.random() > 0.5 ? 4 : 2
        boardState[newTileIndex].isEmpty = false
    },[boardState])

    const moveTiles = useCallback((direction) => {
        const tileIndices = getIndexTraversalOrder(direction, size)
        let tilesMoved = false
        for (let tileIndex of tileIndices) {
            tilesMoved = pushTile(direction, tileIndex) || tilesMoved
        }
        if (tilesMoved) {
            generateNewTile()
        }
    }, [boardState, size, pushTile])

    useArrowKeys(moveTiles)

    return (
        <div className={styles.container}>
            {renderRows(boardState)}
        </div>
    )
}

export default Board