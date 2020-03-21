import React from 'react'
import classNames from 'classnames'
import styles from "./Tile.module.css"

const Tile = ({index, value, isEmpty}) => {
    let otherClassName = null
    if(!isEmpty){
        if (value < 5) otherClassName = styles.fiveOrLess
        else if (value < 20) otherClassName = styles.twentyOrLess
        else if (value < 100) otherClassName = styles.hundredOrLess
        else if (value < 1000) otherClassName = styles.thousandOrLess
    }
    return (
        <div className={classNames(styles.container,otherClassName)}>
            {!isEmpty && value}
        </div>
    )
}

export default Tile