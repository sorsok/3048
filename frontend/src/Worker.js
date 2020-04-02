import { expose } from 'comlink'
import { lookaheadAlgorithm } from './AI'

const exports = {
  lookaheadAlgorithm,
}

expose(exports)
