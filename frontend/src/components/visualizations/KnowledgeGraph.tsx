'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

type Node = {
  id: string;
  title: string;
  category: string;
  confidenceScore: number;
};

type Link = {
  source: string;
  target: string;
  relationship: string;
  strength: number;
};

type KnowledgeGraphProps = {
  nodes: Node[];
  links: Link[];
  height?: number;
  width?: number;
};

export default function KnowledgeGraph({
  nodes,
  links,
  height = 600,
  width = 800,
}: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  // Color scale for different categories
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Create the simulation
    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink<Node, d3.SimulationLinkDatum<Node>>()
          .id((d) => d.id)
          .distance((d) => 100 / (d as any).strength)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Create a group for links
    const linkGroup = svg.append("g").attr("class", "links");

    // Create link elements
    const linkElements = linkGroup
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", (d) => Math.sqrt(d.strength) * 2)
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6);

    // Create a group for nodes
    const nodeGroup = svg.append("g").attr("class", "nodes");

    // Create node elements
    const nodeElements = nodeGroup
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => 10 + d.confidenceScore * 10)
      .attr("fill", (d) => colorScale(d.category) as string)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("mouseover", (event, d) => {
        setHoveredNode(d);
        d3.select(event.currentTarget).attr("stroke", "#000").attr("stroke-width", 2);
      })
      .on("mouseout", (event) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", 1.5);
      })
      .call(
        d3.drag<SVGCircleElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any
      );

    // Add node labels
    const labels = nodeGroup
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.title.substring(0, 20) + (d.title.length > 20 ? "..." : ""))
      .attr("x", 15)
      .attr("y", 4)
      .style("font-size", "10px")
      .style("pointer-events", "none");

    // Set up simulation
    simulation.nodes(nodes).on("tick", ticked);
    
    (simulation.force("link") as d3.ForceLink<Node, d3.SimulationLinkDatum<Node>>)
      .links(links as any);

    // Tick function to update positions
    function ticked() {
      linkElements
        .attr("x1", (d) => (d.source as any).x)
        .attr("y1", (d) => (d.source as any).y)
        .attr("x2", (d) => (d.target as any).x)
        .attr("y2", (d) => (d.target as any).y);

      nodeElements
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!);

      labels
        .attr("x", (d) => d.x! + 12)
        .attr("y", (d) => d.y! + 4);
    }

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup on unmount
    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height, colorScale]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg bg-white"
      />
      {hoveredNode && (
        <div className="absolute top-4 right-4 bg-white p-4 shadow-lg rounded-lg border border-gray-200 max-w-xs">
          <h3 className="font-bold text-lg">{hoveredNode.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Category: {hoveredNode.category}</p>
          <p className="text-sm text-gray-600">
            Confidence: {(hoveredNode.confidenceScore * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
} 