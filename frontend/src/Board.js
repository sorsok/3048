import React, {useCallback, useEffect, useState} from 'react'
import {chooseTwoNumbersInRange, useKeyPress} from "./utils";
import Tile from "./Tile";
import Row from "./Row";

import styles from './Board.module.css'

const up = 'UP'
const down = 'DOWN'
const right = 'RIGHT'
const left = 'LEFT'


const Board = ({size}) => {
    const createEmptyTiles = useCallback(() => {
        const tiles = []
        for (let index = 0; index < size ** 2; index++) {
            tiles.push({index, value: null, isEmpty: true})
        }

        return tiles
    }, [size])

    const createInitialBoardState = useCallback(() => {
        const allTiles = createEmptyTiles()
        const initialIndices = chooseTwoNumbersInRange(0, size ** 2)
        const initialTiles = initialIndices.map((index) => ({index, value: 2, isEmpty: false}))
        initialTiles.forEach(tile => {
            allTiles[tile.index] = tile
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

    const moveTiles = useCallback((direction) => {
        let [countUp, horizontal] = [null, null]
        if (direction === up) [countUp, horizontal] = [true, false]
        if (direction === down) [countUp, horizontal] = [false, false]
        if (direction === left) [countUp, horizontal] = [true, true]
        if (direction === right) [countUp, horizontal] = [false, true]

        for (let i = 0; i < size; i++) {
            const rowNum = countUp ? i : size - 1 - i
            for (let j = 0; j < size; j++) {
                const colNum = countUp ? j : size - 1 - j
                let tileIndex = horizontal ? colNum * size + rowNum : rowNum * size + colNum
                let tile = boardState[tileIndex]
                if (!tile.isEmpty) {
                    let nextTileStep = horizontal ? 1 : size
                    let bounds = (countUp ? Math.floor(tileIndex/size) : Math.ceil(tileIndex/size) ) * size
                    let nextTileIndex = tileIndex - nextTileStep * (countUp ? 1 : -1)
                    let nextTile = boardState[nextTileIndex]
                    while (nextTile) {
                        if (horizontal && countUp && nextTileIndex < bounds){
                            break
                        }
                        if (horizontal && !countUp && nextTileIndex >= bounds){
                            break
                        }
                        if (nextTile.isEmpty) {
                            console.log(`EMPTY: moving from ${tileIndex} to ${nextTileIndex}`)
                            nextTile.value = tile.value
                            nextTile.isEmpty = false
                            tile.value = null
                            tile.isEmpty = true
                        } else if (nextTile.value === tile.value) {
                            console.log(`CLASH: moving from ${tileIndex} to ${nextTileIndex}`)
                            nextTile.value = tile.value * 2
                            tile.value = null
                            tile.isEmpty = true
                        } else {
                            break
                        }

                        tile = nextTile
                        tileIndex = nextTileIndex
                        nextTileIndex = nextTileIndex - nextTileStep * (countUp ? 1 : -1)
                        nextTile = boardState[nextTileIndex]
                    }
                }
            }
        }
    }, [boardState, size])

    const moveTilesUp = useCallback(() => moveTiles(up), [moveTiles, up])
    useKeyPress('ArrowUp', moveTilesUp)
    const moveTilesDown = useCallback(() => moveTiles(down), [moveTiles, down])
    useKeyPress('ArrowDown', moveTilesDown)
    const moveTilesLeft = useCallback(() => moveTiles(left), [moveTiles, left])
    useKeyPress('ArrowLeft', moveTilesLeft)
    const moveTilesRight = useCallback(() => moveTiles(right), [moveTiles, right])
    useKeyPress('ArrowRight', moveTilesRight)

    return (
        <div className={styles.container}>
            {renderRows(boardState)}
        </div>
    )
}

export default Board