import React from 'react'
import styles from "./Tile.module.css"

const Tile = ({index, value, isEmpty}) => {
    return (
        <div className={styles.container}>

            {!isEmpty && value}
        </div>
    )
}

export default Tile