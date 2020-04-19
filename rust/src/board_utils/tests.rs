use super::*;
#[test]
fn apply_and_reverse_actions() {
    let mut board = Board::empty();
    let generate_1 = Action::GENERATE {
        coordinate: Coordinate::new(0, 0),
        value: 2,
    };
    let generate_2 = Action::GENERATE {
        coordinate: Coordinate::new(1, 0),
        value: 2,
    };
    let merge = Action::MERGE {
        to: Coordinate::new(0, 0),
        from: Coordinate::new(1, 0),
    };
    let shift = Action::MOVE {
        to: Coordinate::new(0, 1),
        from: Coordinate::new(0, 0),
    };
    let actions = vec![generate_1, generate_2, merge, shift];
    board.apply_actions(&actions);
    assert_eq!(
        board
            .tile_map
            .get(&Coordinate::new(0, 1))
            .expect("whoops")
            .value,
        4
    );
    assert_eq!(
        board
            .tile_map
            .get(&Coordinate::new(0, 0))
            .expect("whoops")
            .value,
        0
    );
    assert_eq!(
        board
            .tile_map
            .get(&Coordinate::new(1, 0))
            .expect("whoops")
            .value,
        0
    );
    board.reverse_actions(&actions);
    assert_eq!(board, Board::empty());
}

#[test]
fn move_tiles() {
    // ++++   ++++
    // ++++   ++++
    // ++++   ++++
    // 2222   ++44
    let mut board = Board::empty();

    let mut actions = Vec::new();
    for x in 0..SIZE {
        actions.push(Action::GENERATE {
            coordinate: Coordinate::new(x, 0),
            value: 2,
        })
    }
    board.apply_actions(&actions);
    board.move_tiles(&Direction::RIGHT);
    for x in 0..SIZE {
        let expected_value = match x {
            x if x >= SIZE / 2 => 4,
            _ => 0,
        };
        assert_eq!(
            board
                .tile_map
                .get(&Coordinate::new(x, 0))
                .expect("tile not found")
                .value,
            expected_value
        );
    }
    let board_sum: u32 = board.tile_map.values().map(|x| x.value).sum();
    assert_eq!(board_sum, SIZE * 2);
}

#[test]
fn evaluate() {
    // 128 0 0 0
    //   0 0 0 0
    //   0 0 0 0
    //   0 0 0 0
    let mut board = Board::empty();
    board.apply_action(&Action::GENERATE {
        value: 128,
        coordinate: Coordinate::new(0, 0),
    });
    let row_0 = [0, 2, 3, 2]
        .iter()
        .fold(0, |acc, x| acc + x * (128 as i32).pow(2));
    let row_1 = [2, 4, 4, 3]
        .iter()
        .fold(0, |acc, x| acc + x * (128 as i32).pow(2));
    let row_2 = [3, 4, 4, 3]
        .iter()
        .fold(0, |acc, x| acc + x * (128 as i32).pow(2));
    let row_3 = [2, 3, 3, 2]
        .iter()
        .fold(0, |acc, x| acc + x * (128 as i32).pow(2));

    let score = ((row_0 + row_1 + row_2 + row_3) as f32).powf(0.5) / board.tile_map.len() as f32;
    assert_eq!(board.evaluate(), score)
}
