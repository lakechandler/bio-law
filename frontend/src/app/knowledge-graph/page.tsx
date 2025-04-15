'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { laws } from '@/lib/api';
import { Law } from '@/types/law';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphData, Node, Link as GraphLink, NodeType } from '@/types/graph';
import { ForceGraphMethods } from 'react-force-graph-2d';

// Interface for graph data structure
// Using imported types from @/types/graph.ts instead of redefining

export default function KnowledgeGraphPage() {
  const searchParams = useSearchParams();
  const selectedLawId = searchParams.get('law') || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [centerFocus, setCenterFocus] = useState<string | null>(selectedLawId || null);
  const graphRef = useRef<ForceGraphMethods>(undefined);
  
  // Filters for graph display
  const [showPapers, setShowPapers] = useState(true);
  const [showConcepts, setShowConcepts] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  
  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // If we have a selected law, fetch its related items
        let graphData: GraphData = { nodes: [], links: [] };
        
        if (selectedLawId) {
          // Fetch the selected law and its relationships
          const lawData = await laws.getGraphData(selectedLawId);
          graphData = lawData;
        } else {
          // Fetch the global knowledge graph (perhaps limited to top laws)
          const allLawsGraph = await laws.getGlobalGraph(confidenceThreshold);
          graphData = allLawsGraph;
        }
        
        setGraphData(graphData);
        setCenterFocus(selectedLawId || null);
      } catch (err) {
        console.error('Error fetching graph data:', err);
        setError('Failed to load knowledge graph data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGraphData();
  }, [selectedLawId, confidenceThreshold]);
  
  // Apply filters to the graph data
  const filteredGraphData = {
    nodes: graphData.nodes.filter(node => {
      if (!showPapers && node.type === NodeType.PAPER) return false;
      if (!showConcepts && node.type === NodeType.CONCEPT) return false;
      if (node.confidenceScore && node.confidenceScore < confidenceThreshold) return false;
      return true;
    }),
    links: graphData.links.filter(link => {
      const sourceNode = graphData.nodes.find(n => n.id === link.source);
      const targetNode = graphData.nodes.find(n => n.id === link.target);
      
      if (!sourceNode || !targetNode) return false;
      
      if (!showPapers && (sourceNode.type === NodeType.PAPER || targetNode.type === NodeType.PAPER)) return false;
      if (!showConcepts && (sourceNode.type === NodeType.CONCEPT || targetNode.type === NodeType.CONCEPT)) return false;
      
      if (sourceNode.confidenceScore && sourceNode.confidenceScore < confidenceThreshold) return false;
      if (targetNode.confidenceScore && targetNode.confidenceScore < confidenceThreshold) return false;
      
      return true;
    }),
  };
  
  useEffect(() => {
    // Center the graph on the selected node when it changes
    if (centerFocus && graphRef.current) {
      const node = graphData.nodes.find(n => n.id === centerFocus);
      if (node && node.x !== undefined && node.y !== undefined) {
        graphRef.current.centerAt(node.x, node.y, 1000);
        graphRef.current.zoom(2, 1000);
      }
    }
  }, [centerFocus, graphData]);
  
  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setCenterFocus(node.id);
    
    if (graphRef.current && node.x !== undefined && node.y !== undefined) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2, 1000);
    }
  };
  
  // Get node relationships for display in the info panel
  const getNodeRelationships = (nodeId: string) => {
    return graphData.links.filter(
      link => link.source === nodeId || link.target === nodeId
    );
  };
  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Biology Knowledge Graph</h1>
          <p className="mt-1 text-sm text-gray-500">
            Explore the interconnections between biological laws, research papers, and key concepts
          </p>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Controls and filters sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="showPapers"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={showPapers}
                    onChange={(e) => setShowPapers(e.target.checked)}
                  />
                  <label htmlFor="showPapers" className="ml-2 block text-sm text-gray-900">
                    Show Papers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="showConcepts"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={showConcepts}
                    onChange={(e) => setShowConcepts(e.target.checked)}
                  />
                  <label htmlFor="showConcepts" className="ml-2 block text-sm text-gray-900">
                    Show Concepts
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="confidenceThreshold" className="block text-sm font-medium text-gray-700">
                Confidence Threshold: {(confidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                id="confidenceThreshold"
                min="0"
                max="1"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="mt-1 w-full"
              />
            </div>
            
            {/* Selected node information */}
            {selectedNode && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h3 className="font-medium text-gray-900">{selectedNode.name}</h3>
                <div className="mt-1 text-xs text-gray-500">
                  Type: <span className="capitalize">{selectedNode.type}</span>
                </div>
                
                {selectedNode.category && (
                  <div className="mt-1 text-xs text-gray-500">
                    Category: {selectedNode.category}
                  </div>
                )}
                
                {selectedNode.confidenceScore !== undefined && (
                  <div className="mt-1 text-xs text-gray-500">
                    Confidence: {(selectedNode.confidenceScore * 100).toFixed(0)}%
                  </div>
                )}
                
                {selectedNode.type === NodeType.LAW && (
                  <Link
                    href={`/laws/${selectedNode.id}`}
                    className="mt-2 block text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View Law Details
                  </Link>
                )}
                
                {selectedNode.type === NodeType.PAPER && (
                  <Link
                    href={`/papers/${selectedNode.id}`}
                    className="mt-2 block text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View Paper Details
                  </Link>
                )}
                
                {/* Show relationships */}
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-gray-700">Relationships:</h4>
                  <ul className="mt-1 text-xs text-gray-600 space-y-1">
                    {getNodeRelationships(selectedNode.id).map((rel, idx) => {
                      const isSource = rel.source === selectedNode.id;
                      const otherNodeId = isSource ? rel.target : rel.source;
                      const otherNode = graphData.nodes.find(n => n.id === otherNodeId);
                      
                      return (
                        <li key={idx} className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-1 ${
                            rel.type === 'supports' ? 'bg-green-500' : 
                            rel.type === 'contradicts' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></span>
                          {isSource ? 'To' : 'From'}:{' '}
                          <button 
                            onClick={() => {
                              const node = graphData.nodes.find(n => n.id === otherNodeId);
                              if (node) handleNodeClick(node);
                            }}
                            className="ml-1 text-indigo-600 hover:underline"
                          >
                            {otherNode?.name.substring(0, 20)}...
                          </button>
                          <span className="ml-1 italic">({rel.type})</span>
                        </li>
                      );
                    })}
                    
                    {getNodeRelationships(selectedNode.id).length === 0 && (
                      <li className="text-gray-500">No relationships found</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Main graph area */}
        <div className="flex-1 relative bg-gray-50">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
              <span className="ml-2 text-gray-600">Loading knowledge graph...</span>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️</div>
                <h3 className="text-lg font-medium text-gray-900">Error</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <ForceGraph2D
              ref={graphRef}
              graphData={filteredGraphData}
              nodeLabel="name"
              nodeColor={(node: any) => node.color || 
                (node.type === NodeType.LAW ? '#4f46e5' : 
                 node.type === NodeType.PAPER ? '#0891b2' : '#a855f7')
              }
              nodeVal={(node: any) => node.val || 
                (node.type === NodeType.LAW ? 5 : 
                 node.type === NodeType.PAPER ? 3 : 2)
              }
              linkColor={(link: any) => 
                link.type === 'supports' ? '#10b981' : 
                link.type === 'contradicts' ? '#ef4444' : '#6b7280'
              }
              linkWidth={(link: any) => link.value || 1}
              onNodeClick={(node: any) => handleNodeClick(node as Node)}
              cooldownTicks={100}
              linkDirectionalParticles={2}
              linkDirectionalParticleWidth={2}
              height={window.innerHeight - 80}
              width={window.innerWidth - 256}
            />
          )}
        </div>
      </div>
    </div>
  );
} 