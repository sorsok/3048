import React, { useCallback } from 'react'
import Tile from './Tile'
import Row from './Row'

import styles from './Board.scss'

const Board = ({ size, boardState, gameOver }) => {
  const renderRows = useCallback(
    (boardState) => {
      const rows = []
      for (let rowNum = 0; rowNum < size; rowNum++) {
        const row = []
        for (let colNum = 0; colNum < size; colNum++) {
          const tile = boardState[rowNum * size + colNum]
          row.push(<Tile key={`${rowNum}-${colNum}`} {...tile} />)
        }
        rows.push(<Row key={rowNum}>{row}</Row>)
      }
      return rows
    },
    [size]
  )

  return (
    <div className={styles.container}>
      {gameOver && (
        <div className={styles.gameOverContainer}>
          <div className={styles.gameOverBackground}>Game Over!</div>
        </div>
      )}
      {renderRows(boardState)}
    </div>
  )
}

export default Board
