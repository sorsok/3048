mod board_utils;
mod mct_search;
extern crate wasm_bindgen;
#[macro_use]
extern crate serde_derive;
use crate::board_utils::Board;
use crate::mct_search::MCTree;
use wasm_bindgen::prelude::*;

const SEARCH_ITERATIONS: i32 = 100;
const EXPLORATION_PARAMETER: f64 = 1.41;

#[wasm_bindgen]
pub fn search(js_board: &JsValue) -> JsValue {
    let board = Board::from_js(js_board);
    let mut tree = MCTree::new();
    tree.new_node(board, None, None);
    log!(
        "Iterations: {:?} , Exploration parameter: {:?}",
        SEARCH_ITERATIONS,
        EXPLORATION_PARAMETER
    );
    for _ in 0..SEARCH_ITERATIONS {
        tree.perform_search_iteration();
    }
    let next_move = tree.get_best_move();
    log!("Next Move: {:#?}", next_move);
    JsValue::from_serde(&next_move).unwrap()
}
