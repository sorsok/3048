mod MCTSearch;
mod board_utils;

extern crate wasm_bindgen;
#[macro_use]
extern crate serde_derive;

use wasm_bindgen::prelude::*;

use crate::MCTSearch::MCTNode;
use board_utils::{Board, Move};

// #[wasm_bindgen]
// extern "C" {
//     #[wasm_bindgen(js_namespace = console)]
//     fn log(s: &str);
// }
//
// macro_rules! console_log {
//     // Note that this is using the `log` function imported above during
//     // `bare_bones`
//     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
// }

extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub fn search(js_board: &JsValue, depth: u32) -> JsValue {
    let mut board = Board::from_js(js_board);
    let mut root_node = MCTNode::new(board, None);
    root_node.perform_search_iteration();
    log!("hi from rust!");
    let next_move = root_node.get_best_move();
    JsValue::from_serde(&next_move).unwrap()
}
