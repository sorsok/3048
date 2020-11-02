mod board_utils;
mod mct_search;
extern crate wasm_bindgen;
#[macro_use]
extern crate serde_derive;
use crate::board_utils::Board;
use crate::mct_search::{Config, MCTree};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn search(js_board: &JsValue, js_config: &JsValue) -> JsValue {
    console_error_panic_hook::set_once();
    let board = Board::from_js(js_board);
    let config = Config::from_js(js_config);
    let mut tree = MCTree::new(config);
    tree.new_node(board, None, None);
    tree.search();
    let next_move = tree.get_best_move();
    log!("Next Move: {:#?}", next_move);
    JsValue::from_serde(&next_move).unwrap()
}
