import React from 'react'

import styles from './GameInfo.module.css'

const GameInfo = ({score, moveCount, automatedMoveCount}) => {

    return (
        <div className={styles.container}>
            <div className={styles.infoBox}>
                {`Score: ${score}`}
            </div>
            <div className={styles.infoBox}>
                {`Moves: ${moveCount}`}
            </div>
            <div className={styles.infoBox}>
                {`Moves Played For You: ${automatedMoveCount}`}
            </div>
        </div>
    )
}

export default GameInfo