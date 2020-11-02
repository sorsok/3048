import React, { useCallback } from 'react'
import styles from './ConfigManagement.scss'

const ConfigManagement = ({ config, setConfig }) => {
  const updateIterations = useCallback(
    (e) => setConfig({ ...config, iterations: parseInt(e.target.value, 10) }),
    [setConfig, config]
  )
  const updateExploration = useCallback(
    (e) => setConfig({ ...config, exploration: parseFloat(e.target.value) }),
    [setConfig, config]
  )

  return (
    <div className={styles.container}>
      <label htmlFor="iterations">
        Iterations
        <input
          id="iterations"
          type="number"
          value={config.iterations}
          onChange={updateIterations}
        />
      </label>
      <label htmlFor="exploration">
        Exploration
        <input
          id="exploration"
          type="number"
          value={config.exploration}
          onChange={updateExploration}
        />
      </label>
    </div>
  )
}

export default ConfigManagement
