import * as wasm from 'wasm-3048'

self.addEventListener('message', (e) => {
    const {boardState, searchDepth, id, parentDirection, newTileValue} = e.data
    // console.log(boardState.map((tile) => (tile.isEmpty ? 0 : tile.value)))
    // const state = [2,2,8,8,8,8,4,4,2,2,2,2,0,0,0,0]
    const result = wasm.search(
        boardState.map((tile) => (tile.isEmpty ? 0 : tile.value)),
        searchDepth,
        id,
        parentDirection,
        newTileValue,
    )
    self.postMessage({id, parentDirection, newTileValue, ...result})
})
