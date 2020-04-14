extern crate rand;

use rand::Rng;

use super::SIZE;

#[derive(Copy, Clone)]
pub enum Direction {
    UP,
    LEFT,
    RIGHT,
    DOWN,
}
#[derive(Hash, Eq, PartialEq, Debug, Copy)]
pub struct Coordinate {
    x: u32,
    y: u32,
}

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
}

impl Clone for Coordinate {
    fn clone(&self) -> Coordinate {
        Coordinate {
            x: self.x,
            y: self.y,
        }
    }
}
