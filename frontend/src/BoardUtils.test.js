import {
  applyAction,
  reverseAction,
  MOVE,
  applyAllActions,
  reverseAllActions,
  getMoveTilesActions,
  MERGE,
  GENERATE,
} from './BoardUtils'
import { DOWN } from './utils'

const boardState = [
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: 2, isEmpty: false },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: 2, isEmpty: false },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
  { value: null, isEmpty: true },
]

test('apply and reverse actions', () => {
  const boardStateCopy = JSON.parse(JSON.stringify(boardState))
  const action = {
    type: MOVE,
    toIndex: 8,
    fromIndex: 7,
  }
  applyAction(action, boardStateCopy)
  expect(boardStateCopy).toEqual([
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: 2, isEmpty: false },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: 2, isEmpty: false },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
  ])
  reverseAction(action, boardStateCopy)
  expect(boardStateCopy).toEqual(boardState)
})

test('apply and reverse all actions', () => {
  const boardStateCopy = JSON.parse(JSON.stringify(boardState))
  const actions = [
    {
      type: MOVE,
      toIndex: 8,
      fromIndex: 7,
    },
    {
      type: MOVE,
      toIndex: 9,
      fromIndex: 8,
    },
    {
      type: GENERATE,
      index: 2,
      value: 4,
    },
  ]
  applyAllActions(actions, boardStateCopy)
  expect(boardStateCopy).toEqual([
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: 4, isEmpty: false },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: 2, isEmpty: false },
    { value: null, isEmpty: true },
    { value: 2, isEmpty: false },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
  ])
  reverseAllActions(actions, boardStateCopy)
  expect(boardStateCopy).toEqual(boardState)
  expect(actions).toEqual([
    {
      type: MOVE,
      toIndex: 8,
      fromIndex: 7,
    },
    {
      type: MOVE,
      toIndex: 9,
      fromIndex: 8,
    },
    {
      type: GENERATE,
      index: 2,
      value: 4,
    },
  ])
})

test('get move tiles actions', () => {
  const boardStateCopy = JSON.parse(JSON.stringify(boardState))
  const actions = [
    {
      type: MOVE,
      fromIndex: 11,
      toIndex: 15,
    },
    {
      type: MOVE,
      fromIndex: 7,
      toIndex: 11,
    },
    {
      type: MERGE,
      fromIndex: 11,
      toIndex: 15,
    },
  ]
  expect(getMoveTilesActions(DOWN, boardStateCopy)).toEqual(actions)
  expect(boardStateCopy).toEqual(boardState)
  applyAllActions(actions, boardStateCopy)
  expect(boardStateCopy).toEqual([
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: null, isEmpty: true },
    { value: 4, isEmpty: false },
  ])
  reverseAllActions(actions, boardStateCopy)
  expect(boardStateCopy).toEqual(boardState)
})
