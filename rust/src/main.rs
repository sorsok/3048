mod board_utils;
use board_utils::Board;
fn main() {
    let mut board = Board::new();
    println!("{:#?}", board);
}
