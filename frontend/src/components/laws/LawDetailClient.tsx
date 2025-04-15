'use client';

import { Law, Paper, GraphData } from "@/types/law";
import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { getRelatedLaws } from "@/lib/api/laws";
import { useEffect } from "react";

// Client components loaded dynamically with ssr: false
const KnowledgeGraph = dynamic(() => import("@/components/visualizations/KnowledgeGraph"), {
  ssr: false
});

const CitationExporter = dynamic(() => import("@/components/exports/CitationExporter"), {
  ssr: false
});

// Sample papers (in a real app, fetch these from API)
const SAMPLE_PAPERS: Paper[] = [
  {
    title: "Cellular respiration in eukaryotic cells",
    authors: ["Smith, J.", "Jones, K."],
    publishDate: "2022-03-15",
    source: "Nature",
    doi: "10.1038/s41586-021-03819-2"
  },
  {
    title: "ATP production pathways in mammalian cells",
    authors: ["Zhang, L.", "Williams, R.", "Chen, H."],
    publishDate: "2021-07-22",
    source: "Cell",
    doi: "10.1016/j.cell.2021.05.021"
  }
];

// Sample graph data (in a real app, fetch this from API)
const GRAPH_DATA: GraphData = {
  nodes: [
    {
      id: "law1",
      title: "ATP Production in Mitochondria",
      category: "Cell Biology",
      confidenceScore: 0.95
    },
    {
      id: "rel1",
      title: "Mitochondrial Membrane Potential",
      category: "Cell Biology",
      confidenceScore: 0.85
    },
    {
      id: "rel2",
      title: "Glycolysis Energy Yield",
      category: "Biochemistry",
      confidenceScore: 0.92
    },
    {
      id: "rel3",
      title: "Electron Transport Chain Efficiency",
      category: "Molecular Biology",
      confidenceScore: 0.78
    }
  ],
  links: [
    {
      source: "law1",
      target: "rel1",
      relationship: "depends_on",
      strength: 0.8
    },
    {
      source: "law1",
      target: "rel2",
      relationship: "related_to",
      strength: 0.6
    },
    {
      source: "law1",
      target: "rel3",
      relationship: "influences",
      strength: 0.7
    }
  ]
};

interface LawDetailClientProps {
  law: Law;
}

export default function LawDetailClient({ law }: LawDetailClientProps) {
  const [relatedLaws, setRelatedLaws] = useState<Law[]>([]);
  
  useEffect(() => {
    async function fetchRelatedLaws() {
      const laws = await getRelatedLaws(law.id);
      setRelatedLaws(laws);
    }
    
    fetchRelatedLaws();
  }, [law.id]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-8">
          {law.title}
        </h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Law Details</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{law.summary}</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{law.description}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{law.category}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Confidence Score</dt>
                <dd className="mt-1 text-sm text-gray-900">{law.confidenceScore * 100}%</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Tags</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="flex flex-wrap gap-2">
                    {law.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(law.updatedAt).toLocaleDateString()}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Published</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(law.publishedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Supporting Evidence</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Papers that support this biological law</p>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {SAMPLE_PAPERS.map((paper) => (
                <li key={paper.doi} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{paper.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {paper.source}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {paper.authors.join(", ")}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Published on <time dateTime={paper.publishDate}>{new Date(paper.publishDate).toLocaleDateString()}</time>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Related Laws</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Other biological laws that relate to this one</p>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {relatedLaws.map((relatedLaw) => (
                <li key={relatedLaw.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{relatedLaw.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {relatedLaw.category}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{relatedLaw.summary}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Knowledge Graph</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Visual representation of how this law relates to others</p>
            </div>
            <div>
              <Suspense fallback={<div>Loading citation exporter...</div>}>
                <CitationExporter papers={SAMPLE_PAPERS} />
              </Suspense>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6" style={{ height: '400px' }}>
            <Suspense fallback={<div>Loading knowledge graph...</div>}>
              <KnowledgeGraph data={GRAPH_DATA} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 