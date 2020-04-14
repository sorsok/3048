mod coordinate;
mod tile;

use coordinate::{Coordinate, Direction};
use std::collections::HashMap;
use tile::Tile;

const SIZE: u32 = 4;

enum Action {
    MOVE { to: Coordinate, from: Coordinate },
    MERGE { to: Coordinate, from: Coordinate },
    GENERATE { coordinate: Coordinate, value: u32 },
}

#[derive(Debug, Eq, PartialEq)]
pub struct Board {
    pub size: u32,
    pub points: u32,
    pub moves: u32,
    pub tile_map: HashMap<Coordinate, Tile>,
}

impl Board {
    pub fn new() -> Board {
        let mut board = Board::empty();
        let rand_tile_1 = Tile::random();
        let mut rand_tile_2 = Tile::random();
        while rand_tile_1.coordinate() == rand_tile_2.coordinate() {
            rand_tile_2 = Tile::random();
        }
        board.tile_map.insert(rand_tile_1.coordinate(), rand_tile_1);
        board.tile_map.insert(rand_tile_2.coordinate(), rand_tile_2);
        board
    }
    pub fn empty() -> Board {
        let mut tile_map = HashMap::new();
        for x in 0..SIZE {
            for y in 0..SIZE {
                let coordinate = Coordinate::new(x, y);
                tile_map.insert(coordinate, Tile::new(coordinate, 0));
            }
        }
        Board {
            size: SIZE,
            points: 0,
            moves: 0,
            tile_map,
        }
    }
    fn apply_action(&mut self, action: &Action) {
        match action {
            Action::MOVE { to, from } => {
                let from_value;
                {
                    let from_tile = self
                        .tile_map
                        .get_mut(&from)
                        .expect("coordinate not found in tile_map");
                    from_value = from_tile.value;
                    from_tile.value = 0;
                }
                {
                    let to_tile = self
                        .tile_map
                        .get_mut(&to)
                        .expect("coordinate not found in tile_map");
                    to_tile.value = from_value;
                }
            }
            Action::MERGE { to, from } => {
                let from_value;
                {
                    let from_tile = self
                        .tile_map
                        .get_mut(&from)
                        .expect("coordinate not found in tile_map");
                    from_value = from_tile.value;
                    from_tile.value = 0;
                }
                {
                    let to_tile = self
                        .tile_map
                        .get_mut(&to)
                        .expect("coordinate not found in tile_map");
                    to_tile.value += from_value;
                    self.points += to_tile.value;
                }
            }
            Action::GENERATE { coordinate, value } => {
                let mut tile = self
                    .tile_map
                    .get_mut(&coordinate)
                    .expect("coordinate not found in tile_map");
                tile.value = *value;
            }
        };
    }
    fn reverse_action(&mut self, action: &Action) {
        match action {
            Action::MOVE { to, from } => {
                let to_value;
                {
                    let to_tile = self
                        .tile_map
                        .get_mut(&to)
                        .expect("coordinate not found in tile_map");
                    to_value = to_tile.value;
                    to_tile.value = 0;
                }
                {
                    let from_tile = self
                        .tile_map
                        .get_mut(&from)
                        .expect("coordinate not found in tile_map");
                    from_tile.value = to_value;
                }
            }
            Action::MERGE { to, from } => {
                let to_value;
                {
                    let to_tile = self
                        .tile_map
                        .get_mut(&to)
                        .expect("coordinate not found in tile_map");
                    to_value = to_tile.value;
                    to_tile.value = to_value / 2;
                }

                {
                    let from_tile = self
                        .tile_map
                        .get_mut(&from)
                        .expect("coordinate not found in tile_map");
                    from_tile.value = to_value / 2;
                    self.points -= to_value;
                }
            }
            Action::GENERATE {
                coordinate,
                value: _,
            } => {
                let mut tile = self
                    .tile_map
                    .get_mut(&coordinate)
                    .expect("coordinate not found in tile_map");
                tile.value = 0;
            }
        };
    }
    fn apply_actions(&mut self, actions: &Vec<Action>) {
        for action in actions {
            self.apply_action(action)
        }
    }
    fn reverse_actions(&mut self, actions: &Vec<Action>) {
        for action in actions.iter().rev() {
            self.reverse_action(action);
        }
    }

    fn x_iter(direction: &Direction) -> Box<dyn Iterator<Item = u32>> {
        match direction {
            Direction::RIGHT => Box::new((0..SIZE).rev()),
            _ => Box::new(0..SIZE),
        }
    }
    fn y_iter(direction: &Direction) -> Box<dyn Iterator<Item = u32>> {
        match direction {
            Direction::UP => Box::new((0..SIZE).rev()),
            _ => Box::new(0..SIZE),
        }
    }

    fn get_coordinate_traversal_order(direction: &Direction) -> Vec<Coordinate> {
        let mut coordinates = Vec::new();
        for x in Board::x_iter(direction) {
            for y in Board::y_iter(direction) {
                coordinates.push(Coordinate::new(x, y));
            }
        }
        coordinates
    }

    fn move_tiles(&mut self, direction: &Direction) -> Vec<Action> {
        let coordinates = Board::get_coordinate_traversal_order(direction);
        let mut actions = Vec::new();
        for coordinate in coordinates {
            let mut current = coordinate;
            let mut current_value = self
                .tile_map
                .get_mut(&current)
                .expect("coordinate not found in tile_map")
                .value;
            while let Some(adjacent) = current.adjacent(&direction) {
                let adjacent_value = self
                    .tile_map
                    .get_mut(&adjacent)
                    .expect("coordinate not found in tile_map")
                    .value;
                if adjacent_value == current_value {
                    let action = Action::MERGE {
                        to: adjacent,
                        from: current,
                    };
                    self.apply_action(&action);
                    actions.push(action);
                    // this will prevent further merges since no tile can have an equal value
                    current_value = 1;
                } else if adjacent_value == 0 {
                    let action = Action::MOVE {
                        to: adjacent,
                        from: current,
                    };
                    self.apply_action(&action);
                    actions.push(action);
                } else {
                    break;
                }
                current = adjacent;
            }
        }
        actions
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn apply_and_reverse_actions() {
        let mut board = Board::empty();
        println!("Empty Board={:?}", board);
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
}
