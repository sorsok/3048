import * as wasm from 'wasm-3048'

self.addEventListener('message', (e) => {
  const { boardState, searchDepth, id, parentDirection, newTileValue } = e.data

  const result = wasm.search(
    boardState.map((tile) => (tile.isEmpty ? 0 : tile.value)),
    searchDepth
  )
  self.postMessage({ id, parentDirection, newTileValue, ...result })
})
