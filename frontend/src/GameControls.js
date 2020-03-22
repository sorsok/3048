import React from 'react'

import styles from './GameControls.module.css'

const GameControls = ({runningAlgo, toggleAlgo, resetGame}) => {

    return (
            <div className={styles.container}>
                <button className={styles.button} onClick={toggleAlgo}>
                    {runningAlgo ? "Stop Playing For Me" : "Play For Me"}
                </button>
                <button className={styles.button} onClick={resetGame}>
                    Start A New Game
                </button>
            </div>
    )
}

export default GameControls