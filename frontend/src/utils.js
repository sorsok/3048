import { useCallback, useEffect, useMemo, useState } from 'react'

import { wrap, releaseProxy } from 'comlink'

import { DOWN, LEFT, RIGHT, UP } from './BoardUtils'
import { lookaheadAlgorithm } from './AI'

export const useKeyPress = (targetKey, onKeyDownHandler) => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)

  // If pressed key is our target key then set to true
  const downHandler = useCallback(
    ({ key }) => {
      if (key === targetKey) {
        onKeyDownHandler()
        setKeyPressed(true)
      }
    },
    [targetKey, onKeyDownHandler]
  )

  // If released key is our target key then set to false
  const upHandler = useCallback(
    ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false)
      }
    },
    [targetKey]
  )

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [downHandler, upHandler]) // Empty array ensures that effect is only run on mount and unmount

  return keyPressed
}

export const useArrowKeys = onKeyPress => {
  const onKeyPressUp = () => onKeyPress(UP)
  const onKeyPressDown = () => onKeyPress(DOWN)
  const onKeyPressRight = () => onKeyPress(RIGHT)
  const onKeyPressLeft = () => onKeyPress(LEFT)

  useKeyPress('ArrowUp', onKeyPressUp)
  useKeyPress('ArrowDown', onKeyPressDown)
  useKeyPress('ArrowRight', onKeyPressRight)
  useKeyPress('ArrowLeft', onKeyPressLeft)
}

export const useToggle = initialState => {
  const [state, setState] = useState(initialState)
  const toggleState = useCallback(() => setState(!state), [setState, state])
  return [state, toggleState]
}

/**
 * Creates a worker, a cleanup function and returns it
 */
// const makeWorkerApiAndCleanup = () => {
//   // Here we create our worker and wrap it with comlink so we can interact with it
//   const worker = new Worker('./Worker', { type: 'module' })
//   const workerApi = wrap(worker)
//
//   // A cleanup function that releases the comlink proxy and terminates the worker
//   const cleanup = () => {
//     workerApi[releaseProxy]()
//     worker.terminate()
//   }
//
//   const workerApiAndCleanup = { workerApi, cleanup }
//
//   return workerApiAndCleanup
// }
//
// export const useWorker = () => {
//   // memoise a worker so it can be reused; create one worker up front
//   // and then reuse it subsequently; no creating new workers each time
//   const workerApiAndCleanup = useMemo(() => makeWorkerApiAndCleanup(), [])
//
//   useEffect(() => {
//     const { cleanup } = workerApiAndCleanup
//
//     // cleanup our worker when we're done with it
//     return () => {
//       cleanup()
//     }
//   }, [workerApiAndCleanup])
//
//   return workerApiAndCleanup
// }
//
// export const useAlgo = (weights, boardState, runningAlgo, automatedMoveCount, gameOver) => {
//   // We'll want to expose a wrapping object so we know when a calculation is in progress
//   const [move, setMove] = useState(undefined)
//   const [isCalculating, setIsCalculating] = useState(false)
//
//   // acquire our worker
//   const { workerApi } = useWorker()
//
//   useEffect(() => {
//     setMove(undefined)
//     if (!runningAlgo || gameOver) {
//       setMove(undefined)
//       return
//     }
//     if (!isCalculating) {
//       setIsCalculating(true)
//       workerApi.lookaheadAlgorithm(weights, boardState).then(result => {
//         setMove(result)
//         setIsCalculating(false)
//       })
//     }
//   }, [workerApi, setMove, weights, boardState, runningAlgo, automatedMoveCount])
//
//   return move
// }
