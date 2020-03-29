import { useCallback, useEffect, useState } from 'react'
import { DOWN, LEFT, RIGHT, UP } from './BoardUtils'

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
