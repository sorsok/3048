mod MCTSearch;
mod board_utils;

extern crate wasm_bindgen;
#[macro_use]
extern crate serde_derive;

use wasm_bindgen::prelude::*;

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
