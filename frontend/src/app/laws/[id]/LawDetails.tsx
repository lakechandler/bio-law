'use client';

import { Law } from "@/types/law";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Client components loaded dynamically
const KnowledgeGraph = dynamic(() => import("@/components/visualizations/KnowledgeGraph"), {
  ssr: false
});
const CitationExporter = dynamic(() => import("@/components/exports/CitationExporter"), {
  ssr: false
});

interface LawDetailsProps {
  law: Law;
  graphData: {
    nodes: Array<{
      id: string;
      title: string;
      category: string;
      confidenceScore: number;
    }>;
    links: Array<{
      source: string;
      target: string;
      relationship: string;
      strength: number;
    }>;
  };
  papers: Array<{
    title: string;
    authors: string[];
    publishDate: string;
    source: string;
    doi: string;
  }>;
}

export default function LawDetails({ law, graphData, papers }: LawDetailsProps) {
  return (
    <div className="px-4 py-8 sm:px-0">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              {law.category}
            </span>
            {law.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Description</h3>
          <p className="mt-4 text-gray-500">{law.description}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Supporting Evidence</h3>
          <div className="mt-4 space-y-4">
            {law.supportingPapers.map((doi) => (
              <div key={doi} className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">
                    <a href={`https://doi.org/${doi}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                      {doi}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {law.contradictingPapers.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Contradicting Evidence</h3>
            <div className="mt-4 space-y-4">
              {law.contradictingPapers.map((doi) => (
                <div key={doi} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">
                      <a href={`https://doi.org/${doi}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                        {doi}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Knowledge Graph Visualization */}
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Related Laws Network</h3>
          <div className="mt-4">
            <Suspense fallback={<div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
              <KnowledgeGraph nodes={graphData.nodes} links={graphData.links} height={400} width={900} />
            </Suspense>
          </div>
        </div>
        
        {/* Citation Export */}
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Citations</h3>
          <div className="mt-4">
            <Suspense fallback={<div className="h-[200px] w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
              <CitationExporter papers={papers} lawTitle={law.title} />
            </Suspense>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div>
                Last updated: {new Date(law.updatedAt).toLocaleDateString()}
              </div>
              <div>•</div>
              <div>
                Published: {law.publishedAt ? new Date(law.publishedAt).toLocaleDateString() : 'Unpublished'}
              </div>
            </div>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Report an issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 