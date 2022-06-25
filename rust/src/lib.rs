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
pub fn search(
    js_board: &JsValue,
    depth: u32,
    id: String,
    parent_direction: String,
    new_tile_value: u32,
) -> JsValue {
    console_error_panic_hook::set_once();
    let mut board = Board::from_js(js_board);
    // log(&format!(
    //     "RECEIVED: id={}, depth={}, parent_direction={}, new_tile_value={}\n{}",
    //     id,
    //     depth.to_string(),
    //     parent_direction,
    //     new_tile_value.to_string(),
    //     board.board_string()
    // ));
    let next_move = board.recursive_lookahead(depth);
    // log(&format!("depth={}, move={:?}", depth, next_move));
    JsValue::from_serde(&next_move).unwrap()
}
