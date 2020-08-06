mod coordinate;

#[cfg(test)]
mod tests;
mod tile;

use super::log;
use coordinate::Coordinate;
pub use coordinate::Direction;
use enum_iterator::IntoEnumIterator;
use std::collections::HashMap;
use tile::Tile;
use wasm_bindgen::prelude::*;
const SIZE: u32 = 4;

enum Action {
    MOVE { to: Coordinate, from: Coordinate },
    MERGE { to: Coordinate, from: Coordinate },
    GENERATE { coordinate: Coordinate, value: u32 },
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize)]
pub struct Move {
    direction: Option<Direction>,
    score: f32,
    leaves: u32,
}

#[wasm_bindgen]
impl Move {
    pub fn new(direction: Option<Direction>, score: f32, leaves: u32) -> Move {
        Move {
            direction,
            score,
            leaves,
        }
    }
    pub fn to_string(&self) -> String {
        let direction = match self.direction {
            Some(x) => x.to_string(),
            _ => "null".to_string(),
        };
        format!("{}:{}", direction, self.score)
    }
    pub fn empty() -> Move {
        Move {
            score: 0.0,
            direction: None,
            leaves: 0,
        }
    }
}

#[derive(Debug, Eq, PartialEq)]
pub struct Board {
    pub size: u32,
    pub points: u32,
    pub moves: u32,
    pub tile_map: HashMap<Coordinate, Tile>,
}

impl Board {
    pub fn from_js(js_board: &JsValue) -> Board {
        let mut board = Board::empty();
        let tile_values: Vec<u32> = js_board.into_serde().unwrap();
        tile_values.iter().enumerate().for_each(|(i, value)| {
            let coordinate = Coordinate::from_index(i as u32, board.size);
            board
                .tile_map
                .insert(coordinate, Tile::new(coordinate, *value));
        });
        board
    }
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
                    let from_tile = self.tile_map.get_mut(&from).unwrap();
                    from_value = from_tile.value;
                    from_tile.value = 0;
                }
                {
                    let to_tile = self.tile_map.get_mut(&to).unwrap();
                    to_tile.value = from_value;
                }
            }
            Action::MERGE { to, from } => {
                let from_value;
                {
                    let from_tile = self.tile_map.get_mut(&from).unwrap();
                    from_value = from_tile.value;
                    from_tile.value = 0;
                }
                {
                    let to_tile = self.tile_map.get_mut(&to).unwrap();
                    to_tile.value += from_value;
                    self.points += to_tile.value;
                }
            }
            Action::GENERATE { coordinate, value } => {
                let mut tile = self.tile_map.get_mut(&coordinate).unwrap();
                tile.value = *value;
            }
        };
    }
    fn reverse_action(&mut self, action: &Action) {
        match action {
            Action::MOVE { to, from } => {
                let to_value;
                {
                    let to_tile = self.tile_map.get_mut(&to).unwrap();
                    to_value = to_tile.value;
                    to_tile.value = 0;
                }
                {
                    let from_tile = self.tile_map.get_mut(&from).unwrap();
                    from_tile.value = to_value;
                }
            }
            Action::MERGE { to, from } => {
                let to_value;
                {
                    let to_tile = self.tile_map.get_mut(&to).unwrap();
                    to_value = to_tile.value;
                    to_tile.value = to_value / 2;
                }

                {
                    let from_tile = self.tile_map.get_mut(&from).unwrap();
                    from_tile.value = to_value / 2;
                    self.points -= to_value;
                }
            }
            Action::GENERATE {
                coordinate,
                value: _,
            } => {
                let mut tile = self.tile_map.get_mut(&coordinate).unwrap();
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

    pub fn move_tiles(&mut self, direction: &Direction) -> Option<Vec<Action>> {
        let coordinates = Board::get_coordinate_traversal_order(direction);
        let mut actions = Vec::new();
        for coordinate in coordinates {
            let mut current = coordinate;
            let mut current_value = self.tile_map.get_mut(&current).unwrap().value;
            while let Some(adjacent) = current.adjacent(&direction) {
                let adjacent_value = self.tile_map.get_mut(&adjacent).unwrap().value;
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
        match actions.len() {
            x if x == 0 => None,
            _ => Some(actions),
        }
    }

    fn empty_tiles_iter(&self) -> impl Iterator<Item = &Tile> {
        //cache somehow
        self.tile_map.values().filter(|&tile| tile.value == 0)
    }

    fn adjacent_tiles(&self, tile: &Tile) -> Vec<&Tile> {
        tile.coordinate()
            .all_adjacents()
            .iter()
            .map(|coordinate| self.tile_map.get(coordinate).unwrap())
            .collect()
    }

    fn adjacent_equal_tiles(&self) -> Vec<&Tile> {
        self.tile_map
            .values()
            .filter(|&tile| {
                self.adjacent_tiles(tile)
                    .iter()
                    .any(|adjacent_tile| tile.value == adjacent_tile.value)
            })
            .collect()
    }

    pub fn game_over(&self) -> bool {
        if self.empty_tiles_iter().count() > 0 {
            return false;
        }
        let adjacent_equal_tiles = self.adjacent_equal_tiles();
        if adjacent_equal_tiles.len() > 0 {
            return false;
        }
        true
    }

    fn max_tile_value(&self) -> u32 {
        //cache somehow
        self.tile_map
            .values()
            .fold(0, |max, tile| match tile.value {
                x if x > max => x,
                _ => max,
            })
    }

    pub fn evaluate(&self) -> f32 {
        if self.game_over() {
            return -100.0;
        }
        let max_tile_value = self.max_tile_value() as f32;
        let sum = self.tile_map.values().fold(0.0, |total_sum, tile| {
            total_sum
                + self
                    .adjacent_tiles(tile)
                    .iter()
                    .fold(0.0, |tile_sum, adjacent_tile| {
                        let difference = tile.value as f32 - adjacent_tile.value as f32;
                        tile_sum + (max_tile_value - difference.abs()).powf(2.0)
                    })
        });
        return sum.powf(0.5) / self.tile_map.len() as f32;
    }

    pub fn recursive_lookahead(&mut self, depth: u32) -> Move {
        if depth == 0 {
            return Move {
                direction: None,
                score: self.evaluate(),
                leaves: 1,
            };
        }

        Direction::into_enum_iter().fold(Move::empty(), |best_move, direction| {
            match self.move_tiles(&direction) {
                Some(move_actions) => {
                    let two_actions = self.get_generate_actions(2);
                    let two_move = two_actions.iter().fold(Move::empty(), |acc, action| {
                        self.apply_action(&action);
                        let child_move = self.recursive_lookahead(depth - 1);
                        self.reverse_action(&action);
                        Move {
                            direction: None,
                            score: acc.score + child_move.score,
                            leaves: acc.leaves + child_move.leaves,
                        }
                    });
                    let four_actions = self.get_generate_actions(4);
                    let four_move = four_actions.iter().fold(Move::empty(), |acc, action| {
                        self.apply_action(&action);
                        let child_move = self.recursive_lookahead(depth - 1);
                        self.reverse_action(&action);
                        Move {
                            direction: None,
                            score: acc.score + child_move.score,
                            leaves: acc.leaves + child_move.leaves,
                        }
                    });
                    let combined_move = Move {
                        direction: Some(direction),
                        score: (two_move.score * 0.9 + four_move.score * 0.1)
                            / two_actions.len() as f32,
                        leaves: two_move.leaves + four_move.leaves,
                    };
                    self.reverse_actions(&move_actions);
                    if combined_move.score > best_move.score {
                        return Move {
                            direction: Some(direction),
                            score: combined_move.score,
                            leaves: combined_move.leaves + best_move.leaves,
                        };
                    }
                    Move {
                        direction: best_move.direction,
                        score: best_move.score,
                        leaves: combined_move.leaves + best_move.leaves,
                    }
                }
                None => best_move,
            }
        })
    }

    fn get_generate_actions(&self, value: u32) -> Vec<Action> {
        self.empty_tiles_iter()
            .map(move |tile| Action::GENERATE {
                value,
                coordinate: tile.coordinate(),
            })
            .collect()
    }
}
