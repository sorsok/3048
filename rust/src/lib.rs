// Commands to build wasm code and move package to node_modules
// wasm-pack build
// fswatch -o rust/pkg | xargs -n1 -I{} rsync -r rust/pkg/ js/node_modules/wasm-3048

extern crate wasm_bindgen;
#[macro_use]
extern crate serde_derive;

use wasm_bindgen::prelude::*;
mod board_utils;

use board_utils::{Board, Move};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn search(js_board: &JsValue, depth: u32) -> JsValue {
    let mut board = Board::from_js(js_board);
    let next_move = board.recursive_lookahead(depth);
    JsValue::from_serde(&next_move).unwrap()
}
