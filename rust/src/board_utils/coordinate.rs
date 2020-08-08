extern crate rand;
use enum_iterator::IntoEnumIterator;
use std::fmt;
use wasm_bindgen::prelude::*;

use super::SIZE;

use rand::{
    distributions::{Distribution, Standard},
    Rng,
};

#[wasm_bindgen]
#[derive(Copy, Clone, IntoEnumIterator, Debug, Serialize, Deserialize)]
pub enum Direction {
    UP,
    LEFT,
    RIGHT,
    DOWN,
}

impl Distribution<Direction> for Standard {
    fn sample<R: Rng + ?Sized>(&self, rng: &mut R) -> Direction {
        match rng.gen_range(0, 4) {
            0 => Direction::UP,
            1 => Direction::LEFT,
            2 => Direction::RIGHT,
            _ => Direction::DOWN,
        }
    }
}

impl fmt::Display for Direction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

#[wasm_bindgen]
#[derive(Hash, Eq, PartialEq, Debug, Copy)]
pub struct Coordinate {
    x: u32,
    y: u32,
}

// #[wasm_bindgen]
impl Coordinate {
    pub fn new(x: u32, y: u32) -> Coordinate {
        Coordinate { x, y }
    }
    pub fn adjacent(&self, direction: &Direction) -> Option<Coordinate> {
        let (new_x, new_y) = match direction {
            Direction::UP => (self.x as i32, self.y as i32 + 1),
            Direction::DOWN => (self.x as i32, self.y as i32 - 1),
            Direction::RIGHT => (self.x as i32 + 1, self.y as i32),
            Direction::LEFT => (self.x as i32 - 1, self.y as i32),
        };
        if new_x < 0 || new_x >= SIZE as i32 || new_y < 0 || new_y >= SIZE as i32 {
            return None;
        }
        Some(Coordinate {
            x: new_x as u32,
            y: new_y as u32,
        })
    }

    pub fn random() -> Coordinate {
        let mut rng = rand::thread_rng();
        Coordinate {
            x: rng.gen_range(0, SIZE),
            y: rng.gen_range(0, SIZE),
        }
    }

    pub fn all_adjacents(&self) -> Vec<Coordinate> {
        Direction::into_enum_iter()
            .map(|direction| self.adjacent(&direction))
            .filter(|x| x.is_some())
            .map(|x| x.unwrap())
            .collect()
    }

    pub fn from_index(index: u32, size: u32) -> Coordinate {
        let x = index / size;
        let y = index % size;
        Coordinate { x, y }
    }
}

impl Clone for Coordinate {
    fn clone(&self) -> Coordinate {
        Coordinate {
            x: self.x,
            y: self.y,
        }
    }
}
