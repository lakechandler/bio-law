// Node types
export enum NodeType {
  LAW = "law",
  PAPER = "paper",
  CONCEPT = "concept",
}

// Base node interface
export interface Node {
  id: string;
  name: string;
  type: NodeType;
  x?: number;
  y?: number;
  val?: number; // Used for node size
  color?: string;
  confidenceScore?: number;
  category?: string;
}

// Link interface
export interface Link {
  source: string;
  target: string;
  value: number; // Confidence or strength value
  label?: string;
  type?: 'supports' | 'contradicts' | 'relates';
}

// Graph data structure
export interface GraphData {
  nodes: Node[];
  links: Link[];
} 