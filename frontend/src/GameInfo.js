import React from 'react'

import styles from './GameInfo.module.css'

const GameInfo = ({ score, moveCount, automatedMoveCount, stats }) => {
  return (
    <div className={styles.container}>
      <div className={styles.infoBox}>{`Score: ${score}`}</div>
      <div className={styles.infoBox}>{`Moves: ${moveCount}`}</div>
      <div className={styles.infoBox}>{`Moves Played For You: ${automatedMoveCount}`}</div>
      <div className={styles.scores}>
        <div className={styles.scoreBox}>{`Adjacency Score: ${Math.round(
          stats.adjacencyScore
        )}`}</div>
        <div className={styles.scoreBox}>{`Density Score: ${Math.round(stats.density)}`}</div>
        <div className={styles.scoreBox}>{`Total Score: ${Math.round(stats.total)}`}</div>
      </div>
    </div>
  )
}

export default GameInfo
