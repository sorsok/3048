#[cfg(test)]
mod tests;
use std::collections::HashMap;
extern crate console_error_panic_hook;
use crate::{
    board_utils::{Board, Direction, Move},
    log, EXPLORATION_PARAMETER,
};

#[derive(Clone, Copy, Debug)]
pub struct NodeID {
    index: usize,
}

#[derive(Debug)]
pub struct MCTree {
    nodes: Vec<Node>,
}

#[derive(Debug)]
pub struct Node {
    id: Option<NodeID>,
    parent: Option<NodeID>,
    children: Vec<NodeID>,
    board: Board,
    visited_count: u32,
    value: u32,
    direction: Option<Direction>, // direction that gets you from parent to this node
}

impl MCTree {
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        MCTree { nodes: vec![] }
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
            value: 0,
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

    pub fn perform_search_iteration(&mut self) {
        let mut traversed = vec![NodeID { index: 0 }];
        loop {
            println!("traversed: {:#?}", traversed);
            let current_id = traversed.pop().unwrap();
            let current_node = self.get_node(current_id);

            if current_node.children.len() == 0 && current_node.visited_count == 0 {
                // reached leaf that has never been rolled out
                traversed.push(current_id);
                break;
            }
            if current_node.children.len() == 0 {
                // reached already rolled out leaf - let's expand it
                let child_nodes = current_node.generate_children();
                self.add_children(current_id, child_nodes);
                traversed.push(current_id);
                continue;
            }
            match current_node.get_best_child_id(self) {
                Some(next_child_id) => {
                    traversed.push(current_id);
                    traversed.push(next_child_id);
                }
                _ => {
                    // current node has already been rolled out and cannot be expanded (game over)
                    // terminate search
                    println!("Reached terminating node of search tree");
                    return;
                }
            }
        }
        let leaf = self.get_node_mut(traversed.pop().unwrap());
        let new_value = leaf.rollout();
        traversed.push(leaf.id.unwrap());
        println!("Rollout new value: {:#?}", new_value);
        for node_id in traversed {
            println!("Updating value and visited count of node={:#?}", node_id);
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
            let counter = options
                .entry(child_node.direction.unwrap())
                .or_insert((0, 0.0));
            counter.0 += 1;
            counter.1 += root.ucb_value(child_node);
        }
        //log!("Options: {:#?}", options);
        //log!("Root Board: {:#?}", root.board);
        let mut best_score = 0.0;
        let mut best_direction = None;
        for (direction, (tally, sum)) in options {
            let score = sum / tally as f64;
            if score > best_score {
                best_score = score;
                best_direction = Some(direction);
            }
        }
        Move::new(best_direction, best_score as f32, 1)
    }

    fn get_node(&self, node_id: NodeID) -> &Node {
        &self.nodes[node_id.index]
    }

    fn get_node_mut(&mut self, node_id: NodeID) -> &mut Node {
        &mut self.nodes[node_id.index]
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
            value: 0,
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

    fn get_best_child_id(&self, tree: &MCTree) -> Option<NodeID> {
        let mut best_ucb = 0.0;
        let mut best_child = None;
        for &child_id in &self.children {
            let child_ucb = self.ucb_value(tree.get_node(child_id));
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

    fn ucb_value(&self, child_node: &Node) -> f64 {
        if child_node.visited_count == 0 {
            return f64::INFINITY;
        }
        (child_node.value as f64 / child_node.visited_count as f64)
            + EXPLORATION_PARAMETER
                * ((self.visited_count as f64).ln() / (child_node.visited_count as f64)).sqrt()
    }

    fn rollout(&mut self) -> u32 {
        self.board.rollout()
    }
}
