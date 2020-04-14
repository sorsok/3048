import React from 'react'
import styles from './Row.scss'

const Row = ({children}) => {
    return (
            <div className={styles.container}>
                {children}
            </div>
        )
}

export default Row