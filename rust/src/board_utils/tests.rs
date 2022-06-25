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
    let move_actions = board.move_tiles(&Direction::RIGHT);
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

    board.reverse_actions(&move_actions.unwrap());
    print!("{}", board.board_string())
}

#[test]
fn move_tiles_complex_right() {
    // ++++   ++++
    // ++++   ++++
    // ++++   ++++
    // 2244   ++48
    let mut board = Board::empty();
    board
        .tile_map
        .insert(Coordinate::new(0, 0), Tile::new(Coordinate::new(0, 0), 2));
    board
        .tile_map
        .insert(Coordinate::new(1, 0), Tile::new(Coordinate::new(1, 0), 2));
    board
        .tile_map
        .insert(Coordinate::new(2, 0), Tile::new(Coordinate::new(2, 0), 4));
    board
        .tile_map
        .insert(Coordinate::new(3, 0), Tile::new(Coordinate::new(3, 0), 4));

    let move_actions = board.move_tiles(&Direction::RIGHT);
    let non_empty_coordinates = vec![Coordinate::new(2, 0), Coordinate::new(3, 0)];
    for x in 0..4 {
        for y in 0..4 {
            let coord = Coordinate::new(x, y);
            if !non_empty_coordinates.contains(&coord) {
                assert_eq!(board.tile_map.get(&coord).unwrap().value, 0);
            }
        }
    }
    assert_eq!(board.tile_map.get(&Coordinate::new(2, 0)).unwrap().value, 4);
    assert_eq!(board.tile_map.get(&Coordinate::new(3, 0)).unwrap().value, 8);
    let board_sum: u32 = board.tile_map.values().map(|x| x.value).sum();
    assert_eq!(board_sum, 12);

    board.reverse_actions(&move_actions.unwrap());
    print!("{}", board.board_string())
}

#[test]
fn move_tiles_complex_down() {
    // +++2   ++++
    // +++2   ++++
    // +++4   +++4
    // +++4   +++8
    let mut board = Board::empty();
    board
        .tile_map
        .insert(Coordinate::new(3, 0), Tile::new(Coordinate::new(3, 0), 4));
    board
        .tile_map
        .insert(Coordinate::new(3, 1), Tile::new(Coordinate::new(3, 1), 4));
    board
        .tile_map
        .insert(Coordinate::new(3, 2), Tile::new(Coordinate::new(3, 2), 2));
    board
        .tile_map
        .insert(Coordinate::new(3, 3), Tile::new(Coordinate::new(3, 3), 2));
    println!("{}", board.board_string());

    let move_actions = board.move_tiles(&Direction::DOWN);
    let non_empty_coordinates = vec![Coordinate::new(3, 0), Coordinate::new(3, 1)];
    for x in 0..4 {
        for y in 0..4 {
            let coord = Coordinate::new(x, y);
            if !non_empty_coordinates.contains(&coord) {
                assert_eq!(board.tile_map.get(&coord).unwrap().value, 0);
            }
        }
    }
    assert_eq!(board.tile_map.get(&Coordinate::new(3, 0)).unwrap().value, 8);
    assert_eq!(board.tile_map.get(&Coordinate::new(3, 1)).unwrap().value, 4);
    let board_sum: u32 = board.tile_map.values().map(|x| x.value).sum();
    assert_eq!(board_sum, 12);
    println!("{}", board.board_string());
    board.reverse_actions(&move_actions.unwrap());
    println!("{}", board.board_string())
}

#[test]
fn move_tiles_complex_left() {
    // 4422   84++
    // ++++   ++++
    // ++++   ++++
    // ++++   ++++
    let mut board = Board::empty();
    board
        .tile_map
        .insert(Coordinate::new(0, 3), Tile::new(Coordinate::new(0, 3), 4));
    board
        .tile_map
        .insert(Coordinate::new(1, 3), Tile::new(Coordinate::new(1, 3), 4));
    board
        .tile_map
        .insert(Coordinate::new(2, 3), Tile::new(Coordinate::new(2, 3), 2));
    board
        .tile_map
        .insert(Coordinate::new(3, 3), Tile::new(Coordinate::new(3, 3), 2));
    println!("{}", board.board_string());

    let move_actions = board.move_tiles(&Direction::LEFT);
    let non_empty_coordinates = vec![Coordinate::new(0, 3), Coordinate::new(1, 3)];
    for x in 0..4 {
        for y in 0..4 {
            let coord = Coordinate::new(x, y);
            if !non_empty_coordinates.contains(&coord) {
                assert_eq!(board.tile_map.get(&coord).unwrap().value, 0);
            }
        }
    }
    assert_eq!(board.tile_map.get(&Coordinate::new(0, 3)).unwrap().value, 8);
    assert_eq!(board.tile_map.get(&Coordinate::new(1, 3)).unwrap().value, 4);
    let board_sum: u32 = board.tile_map.values().map(|x| x.value).sum();
    assert_eq!(board_sum, 12);
    println!("{}", board.board_string());
    board.reverse_actions(&move_actions.unwrap());
    println!("{}", board.board_string())
}

#[test]
fn move_tiles_complex_up() {
    // 4+++   8+++
    // 4+++   4+++
    // 2+++   ++++
    // 2+++   ++++
    let mut board = Board::empty();
    board
        .tile_map
        .insert(Coordinate::new(0, 0), Tile::new(Coordinate::new(0, 0), 2));
    board
        .tile_map
        .insert(Coordinate::new(0, 1), Tile::new(Coordinate::new(0, 1), 2));
    board
        .tile_map
        .insert(Coordinate::new(0, 2), Tile::new(Coordinate::new(0, 2), 4));
    board
        .tile_map
        .insert(Coordinate::new(0, 3), Tile::new(Coordinate::new(0, 3), 4));
    println!("{}", board.board_string());

    let move_actions = board.move_tiles(&Direction::UP);
    let non_empty_coordinates = vec![Coordinate::new(0, 3), Coordinate::new(0, 2)];
    for x in 0..4 {
        for y in 0..4 {
            let coord = Coordinate::new(x, y);
            if !non_empty_coordinates.contains(&coord) {
                assert_eq!(board.tile_map.get(&coord).unwrap().value, 0);
            }
        }
    }
    assert_eq!(board.tile_map.get(&Coordinate::new(0, 3)).unwrap().value, 8);
    assert_eq!(board.tile_map.get(&Coordinate::new(0, 2)).unwrap().value, 4);
    let board_sum: u32 = board.tile_map.values().map(|x| x.value).sum();
    assert_eq!(board_sum, 12);
    println!("{}", board.board_string());
    board.reverse_actions(&move_actions.unwrap());
    println!("{}", board.board_string())
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
