use super::*;

#[test]
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

#[test]
fn get_best_move() {
    let board = Board::new();
    let mut tree = MCTree::new();
    tree.new_node(board, None, None);
    tree.perform_search_iteration();
    let best_move_1 = tree.get_best_move();
    assert_eq!(best_move_1, Move::empty());

    tree.perform_search_iteration();
    let best_move_2 = tree.get_best_move();
    assert_ne!(best_move_2, Move::empty());
}
