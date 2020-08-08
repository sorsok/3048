use crate::board_utils::{Board, Direction, Move};
use enum_iterator::IntoEnumIterator;
use std::collections::HashMap;

pub struct MCTNode {
    board: Board,
    visited_count: u32,
    value: u32,
    children: Vec<MCTNode>,
    direction: Option<Direction>, // direction that gets you from parent to this node
}

impl MCTNode {
    pub fn new(board: Board, direction: Option<Direction>) -> MCTNode {
        MCTNode {
            board,
            visited_count: 0,
            value: 0,
            children: vec![],
            direction,
        }
    }

    pub fn perform_search_iteration(&mut self) {
        let mut traversed = vec![];
        traversed.push(self);
        loop {
            let mut current = traversed.pop().unwrap();
            if current.children.len() == 0 && current.visited_count == 0 {
                // reached leaf that has never been rolled out
                traversed.push(current);
                break;
            }
            if current.children.len() == 0 {
                // reached already rolled out leaf - let's expand it
                current.generate_children()
            }
            match current.get_best_child_index() {
                Some(index) => {
                    traversed.push(current.children.get_mut(index).unwrap());
                }
                _ => {
                    // current node has already been rolled out and cannot be expanded (game over)
                    // terminate search
                    // consolelog
                    return;
                }
            }
        }
        let mut leaf = traversed.pop().unwrap();
        let new_value = leaf.rollout();
        for node in traversed {
            node.value += new_value;
            node.visited_count += 1;
        }
    }

    pub fn get_best_move(&mut self) -> Move {
        if self.children.len() == 0 {
            return Move::empty();
        }
        let mut options: Vec<_> = Direction::into_enum_iter()
            .map(|direction| {
                let child_nodes: Vec<_> = self
                    .children
                    .iter()
                    .filter(|child| child.direction.unwrap() == direction)
                    .collect();
                return (
                    direction,
                    child_nodes
                        .iter()
                        .fold(0 as f64, |acc, child| acc + self.ucb_value(child))
                        / child_nodes.len() as f64,
                );
            })
            .collect();

        options.sort_unstable_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

        Move::new(Some(options[0].0), options[0].1 as f32, 1)
    }

    fn generate_children(&mut self) {
        let child_nodes = self.board.generate_children();
        for (board, direction) in child_nodes {
            self.children.push(MCTNode::new(board, Some(direction)));
        }
    }

    fn get_best_child_index(&self) -> Option<usize> {
        match self
            .children
            .iter()
            .enumerate()
            .fold(None, |acc, (index, child)| match acc {
                Some((_, acc_node)) => {
                    if self.ucb_value(acc_node) > self.ucb_value(child) {
                        acc
                    } else {
                        Some((index, child))
                    }
                }
                _ => Some((index, child)),
            }) {
            Some((index, node)) => Some(index),
            None => None,
        }
    }

    fn ucb_value(&self, child_node: &MCTNode) -> f64 {
        if child_node.visited_count == 0 {
            return f64::INFINITY;
        }
        child_node.value as f64
            + 2.0 * ((self.visited_count as f64).ln() / (child_node.visited_count as f64)).sqrt()
    }

    fn rollout(&mut self) -> u32 {
        self.board.rollout()
    }
}
