//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn perform_search_iteration() {
    let board = Board::new();
    let mut tree = MCTree::new();
    tree.new_node(board, None, None);
    tree.perform_search_iteration();

    println!("{:#?}", tree.get_root().children.len());
    println!("{:#?}", tree.get_root().visited_count);
    println!("{:#?}", tree.get_root().value);
    assert_eq!(tree.get_root().children.len(), 0);
    assert_eq!(tree.get_root().visited_count, 1);
    assert_ne!(tree.get_root().value, 0);
    let first_root_value = tree.get_root().value;

    tree.perform_search_iteration();
    println!("{:#?}", tree.get_root().children.len());
    println!("{:#?}", tree.get_root().visited_count);
    println!("{:#?}", tree.get_root().value);
    assert_ne!(tree.get_root().children.len(), 0);
    assert_eq!(tree.get_root().visited_count, 2);
    assert!(tree.get_root().value > first_root_value);
    let second_root_value = tree.get_root().value;

    tree.perform_search_iteration();
    println!("{:#?}", tree.get_root().children.len());
    println!("{:#?}", tree.get_root().visited_count);
    println!("{:#?}", tree.get_root().value);
    assert_ne!(tree.get_root().children.len(), 0);
    assert_eq!(tree.get_root().visited_count, 3);
    assert!(tree.get_root().value > second_root_value);
}
