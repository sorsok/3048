import React from 'react'
import PropTypes from 'prop-types'
import styles from './GameInfo.scss'

const GameInfo = ({ score, moveCount, automatedMoveCount }) => {
  return (
    <div className={styles.container}>
      <div className={styles.infoBox}>{`Game Score: ${score}`}</div>
      <div className={styles.infoBox}>{`Moves: ${moveCount}`}</div>
      <div className={styles.infoBox}>{`Moves Played For You: ${automatedMoveCount}`}</div>
    </div>
  )
}

export default GameInfo

GameInfo.propTypes = {
  score: PropTypes.number.isRequired,
  moveCount: PropTypes.number.isRequired,
  automatedMoveCount: PropTypes.number.isRequired,
  moveHistory: PropTypes.arrayOf(PropTypes.shape({ score: PropTypes.number.isRequired })),
}

GameInfo.defaultProps = {}
