use crate::board_utils::{Board, Direction};

pub struct Node {
    board: Board,
    visited_count: u32,
    value: u32,
    parent: Option<Box<Node>>,
    children: Vec<Box<Node>>,
}

impl Node {
    pub fn new(board: Board, parent: Option<Box<Node>>) -> Node {
        Node {
            board,
            visited_count: 0,
            value: 0,
            parent,
            children: vec![],
        }
    }
    pub fn ucb_value(&self) -> f64 {
        self.value as f64
            + 2.0
                * (((*(self.parent.as_ref().unwrap())).visited_count as f64).ln()
                    / self.visited_count as f64)
                    .sqrt()
    }

    pub fn rollout(&mut self) -> u32 {
        self.board.rollout()
    }

    pub fn perform_search_iteration(&mut self) {
        let mut traversed = Vec::new();
        traversed.push(self);
        loop {
            let mut current = traversed.pop().unwrap();
            match current.choose_child() {
                Some(next) => {
                    traversed.push(next);
                }
                _ => break,
            }
        }
        let mut leaf = traversed.pop().unwrap();
        let new_value = leaf.rollout();
        for node in traversed {
            node.value += new_value;
            node.visited_count += 1;
        }
    }

    pub fn choose_child(&mut self) -> Option<&mut Node> {
        self.children.iter_mut().fold(None, |acc, child| match acc {
            Some(node) => {
                if node.ucb_value() > child.ucb_value() {
                    Some(node)
                } else {
                    Some(child)
                }
            }
            _ => Some(child),
        })
    }
}
