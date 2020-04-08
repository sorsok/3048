import React from 'react'
import PropTypes from 'prop-types'

import styles from './GameInfo.scss'

const COLOURS = [
  '#0d9d2d',
  '#1b9329',
  '#288824',
  '#367d20',
  '#43731b',
  '#516817',
  '#5e5e12',
  '#6c530e',
  '#794809',
  '#873e05',
]

const GameInfo = ({ score, moveCount, automatedMoveCount, moveHistory }) => {
  const lastMove = moveHistory[moveHistory.length - 1]
  let changeInScore = 0
  if (moveHistory.length > 1) {
    changeInScore = lastMove.score - moveHistory[moveHistory.length - 2].score
  }
  const percentChangeInScore = (changeInScore * 100) / lastMove.score || 0
  let colourIndex = 5 - percentChangeInScore
  if (colourIndex < 0) colourIndex = 0
  if (colourIndex > 9) colourIndex = 9
  colourIndex = Math.round(colourIndex, 0)
  const color = COLOURS[colourIndex]

  return (
    <div className={styles.container}>
      <div className={styles.infoBox}>{`Game Score: ${score}`}</div>
      <div className={styles.infoBox}>{`Moves: ${moveCount}`}</div>
      <div className={styles.infoBox}>{`Moves Played For You: ${automatedMoveCount}`}</div>
      <div className={styles.infoBox}>{`AI Score: ${Math.round(lastMove.score, 2)}`}</div>
      <div className={styles.infoBox} style={{ backgroundColor: color }}>
        {`Change In Score: ${Math.round(changeInScore, 2)}`}
      </div>
      <div className={styles.infoBox} style={{ backgroundColor: color }}>
        {`% Change In Score: ${Math.round(percentChangeInScore, 2)}`}
      </div>
    </div>
  )
}

export default GameInfo

GameInfo.propTypes = {
  score: PropTypes.number.isRequired,
  moveCount: PropTypes.number.isRequired,
  automatedMoveCount: PropTypes.number.isRequired,
  moveHistory: PropTypes.number.isRequired,
}

GameInfo.defaultProps = {}
