extern crate rand;
use rand::prelude::*;

use super::coordinate::Coordinate;

#[derive(Hash, Eq, PartialEq, Debug, Clone)]
pub struct Tile {
    coordinate: Coordinate,
    pub value: u32,
}

impl Tile {
    pub fn new(coordinate: Coordinate, value: u32) -> Tile {
        Tile { coordinate, value }
    }
    pub fn random_value() -> u32 {
        let mut rng = rand::thread_rng();
        match rng.gen::<f32>() {
            x if x > 0.9 => 4,
            x if x <= 0.9 => 2,
            _ => unreachable!(),
        }
    }
    pub fn random() -> Tile {
        Tile {
            coordinate: Coordinate::random(),
            value: Tile::random_value(),
        }
    }
    pub fn coordinate(&self) -> Coordinate {
        self.coordinate
    }
}
