#[cfg(test)]
mod tests;

use std::collections::HashMap;

extern crate console_error_panic_hook;

use crate::{
    board_utils::{Board, Direction, Move},
    log,
};
use wasm_bindgen::__rt::core::f32::NEG_INFINITY;
use wasm_bindgen::prelude::*;

#[derive(Clone, Copy, Debug)]
pub struct NodeID {
    index: usize,
}

#[derive(Debug)]
pub struct MCTree {
    nodes: Vec<Node>,
    config: Config,
}

#[derive(Debug)]
pub struct Node {
    id: Option<NodeID>,
    parent: Option<NodeID>,
    children: Vec<NodeID>,
    board: Board,
    visited_count: u32,
    value: f32,
    direction: Option<Direction>, // direction that gets you from parent to this node
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    iterations: u32,
    exploration: f64,
}

impl Config {
    pub fn from_js(js_config: &JsValue) -> Self {
        js_config.into_serde().unwrap()
    }
}

impl MCTree {
    pub fn new(config: Config) -> Self {
        MCTree {
            nodes: vec![],
            config,
        }
    }

    pub fn new_node(
        &mut self,
        board: Board,
        parent: Option<NodeID>,
        direction: Option<Direction>,
    ) -> NodeID {
        let node = Node {
            id: None,
            board,
            visited_count: 0,
            value: 0.0,
            children: vec![],
            direction,
            parent,
        };
        self.add_node(node)
    }

    fn add_node(&mut self, mut node: Node) -> NodeID {
        let node_id = NodeID {
            index: self.nodes.len(),
        };
        node.id = Some(node_id);
        self.nodes.push(node);
        node_id
    }

    pub fn get_root(&self) -> &Node {
        &self.nodes[0]
    }

    pub fn search(&mut self) {
        log!(
            "Iterations: {:?} , Exploration parameter: {:?}",
            self.config.iterations,
            self.config.exploration
        );
        for x in 0..self.config.iterations {
            // log!("Performing iteration {:?}", x);
            self.perform_search_iteration();
        }
    }

    pub fn perform_search_iteration(&mut self) {
        let mut traversed = vec![NodeID { index: 0 }];
        loop {
            let current_id = traversed.pop().unwrap();
            let current_node = self.get_node(current_id);
            //log!(
            //     "Considering node: {:#?} {:#?} {:#?}",
            //     current_id,
            //     current_node,
            //     current_node.children.len()
            // );

            if current_node.children.len() == 0 && current_node.visited_count == 0 {
                // reached leaf that has never been rolled out
                traversed.push(current_id);
                break;
            }
            if current_node.children.len() == 0 {
                // reached already rolled out leaf - let's expand it
                let child_nodes = current_node.generate_children();
                if child_nodes.len() == 0 {
                    // expanding is not possible - terminate iteration
                    return;
                }
                self.add_children(current_id, child_nodes);
                traversed.push(current_id);
                continue;
            }
            match self.get_best_child_id(current_id) {
                Some(next_child_id) => {
                    traversed.push(current_id);
                    traversed.push(next_child_id);
                }
                _ => {
                    // current node has already been rolled out and cannot be expanded (game over)
                    // terminate search
                    log!("Reached terminating node of search tree");
                    println!("Reached terminating node of search tree");
                    return;
                }
            }
        }
        let leaf = self.get_node_mut(traversed.pop().unwrap());
        let new_value = leaf.rollout();
        traversed.push(leaf.id.unwrap());
        println!("Rollout new value: {:#?}", new_value);
        //log!("Rollout new value: {:#?}", new_value);
        for node_id in traversed {
            println!("Updating value and visited count of node={:#?}", node_id);
            //log!("Updating value and visited count of node={:#?}", node_id);
            let mut node = self.get_node_mut(node_id);
            node.value += new_value;
            node.visited_count += 1;
        }
    }

    fn add_children(&mut self, parent_id: NodeID, children: Vec<Node>) {
        let mut child_ids = vec![];
        for mut child in children {
            child.parent = Some(parent_id);
            child_ids.push(self.add_node(child));
        }
        self.get_node_mut(parent_id).children = child_ids;
    }

    pub fn get_best_move(&mut self) -> Move {
        let root = self.get_root();
        if root.children.len() == 0 {
            return Move::empty();
        }
        let mut options = HashMap::new();
        for &child_id in &root.children {
            let child_node = self.get_node(child_id);
            let mut counter = options.entry(child_node.direction.unwrap()).or_insert(0.0);
            let child_ucb = self.child_ucb_value(root.id.unwrap(), child_id);
            if child_ucb > *counter {
                *counter = child_ucb;
            }
        }
        log!("Options: {:#?}", options);
        //log!("Root Board: {:#?}", root.board);
        let mut best_score = f64::NEG_INFINITY;
        let mut best_direction = None;
        for (direction, score) in options {
            if score > best_score {
                best_score = score;
                best_direction = Some(direction);
            }
        }
        Move::new(best_direction, best_score as f32, self.nodes.len() as u32)
    }

    fn get_node(&self, node_id: NodeID) -> &Node {
        &self.nodes[node_id.index]
    }

    fn get_best_child_id(&self, parent_id: NodeID) -> Option<NodeID> {
        let parent = self.get_node(parent_id);
        let mut best_ucb = 0.0;
        let mut best_child = None;
        for &child_id in &parent.children {
            let child_ucb = self.child_ucb_value(parent_id, child_id);
            if child_ucb == f64::INFINITY {
                return Some(child_id);
            }
            if child_ucb > best_ucb {
                best_ucb = child_ucb;
                best_child = Some(child_id);
            }
        }
        best_child
    }

    fn get_node_mut(&mut self, node_id: NodeID) -> &mut Node {
        &mut self.nodes[node_id.index]
    }

    fn child_ucb_value(&self, parent_id: NodeID, child_id: NodeID) -> f64 {
        let parent_node = self.get_node(parent_id);
        let child_node = self.get_node(child_id);
        if child_node.visited_count == 0 {
            return f64::INFINITY;
        }
        (child_node.value as f64 / child_node.visited_count as f64)
            + self.config.exploration
                * ((parent_node.visited_count as f64).ln() / (child_node.visited_count as f64))
                    .sqrt()
    }
}

impl Node {
    fn new(parent: Option<NodeID>, board: Board, direction: Option<Direction>) -> Self {
        Node {
            id: None,
            parent,
            children: vec![],
            board,
            visited_count: 0,
            value: 0.0,
            direction,
        }
    }

    fn generate_children(&self) -> Vec<Self> {
        let mut children = vec![];
        for (board, direction) in self.board.generate_children() {
            children.push(Node::new(self.id, board, Some(direction)));
        }
        children
    }

    fn rollout(&mut self) -> f32 {
        self.board.rollout() as f32
    }
}
