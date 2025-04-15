'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { GraphData, Node, Link } from '@/types/graph';
import { ForceGraphMethods } from 'react-force-graph-2d';

// Dynamically import ForceGraph2D with no SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface KnowledgeGraphProps {
  data: GraphData;
  height?: number;
  width?: number;
  onNodeClick?: (node: Node) => void;
}

export default function KnowledgeGraph({ 
  data, 
  height = 600, 
  width = 800, 
  onNodeClick 
}: KnowledgeGraphProps) {
  const graphRef = useRef<ForceGraphMethods>(undefined);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });

  useEffect(() => {
    if (data && data.nodes.length > 0) {
      setGraphData(data);
    }
  }, [data]);

  return (
    <div className="relative border rounded-lg overflow-hidden bg-gray-50">
      {graphData.nodes.length > 0 ? (
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          height={height}
          width={width}
          nodeAutoColorBy="type"
          nodeVal={(node) => node.val || 1}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
          linkWidth={(link) => (link as Link).value * 0.5}
          nodeLabel={(node) => `${(node as Node).name}`}
          onNodeClick={(node) => onNodeClick && onNodeClick(node as Node)}
          cooldownTicks={100}
          d3VelocityDecay={0.1}
        />
      ) : (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <p className="text-gray-500">No graph data available</p>
        </div>
      )}
    </div>
  );
} 