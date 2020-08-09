import * as wasm from 'wasm-3048'

self.addEventListener('message', (e) => {
  const { boardState } = e.data

  const result = wasm.search(boardState.map((tile) => (tile.isEmpty ? 0 : tile.value)))
  self.postMessage(result)
})
