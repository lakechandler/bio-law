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

// Sample related laws (in a real app, fetch these from API)
const RELATED_LAWS = [
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
];

// Sample papers (in a real app, fetch these from API)
const SAMPLE_PAPERS = [
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

async function getLaw(id: string): Promise<Law> {
  // TODO: Replace with actual API call
  return {
    id,
    title: "Cellular Respiration ATP Production",
    description: "The process of cellular respiration produces 36-38 ATP molecules per glucose molecule under optimal conditions.",
    content: "The process of cellular respiration involves several metabolic pathways including glycolysis, the citric acid cycle, and oxidative phosphorylation. Under optimal conditions with proper oxygen supply, these processes can generate 36-38 ATP molecules from a single glucose molecule.",
    confidenceScore: 0.95,
    category: "Cellular Biology",
    tags: ["metabolism", "energy", "cellular respiration", "ATP"],
    supportingPapers: ["10.1038/s41586-021-03819-2"],
    contradictingPapers: [],
    status: "published",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    publishedAt: new Date("2024-01-01"),
    archivedAt: null,
    authorId: "system-extraction",
  };
}

export default async function LawPage({ params }: { params: { id: string } }) {
  const law = await getLaw(params.id);

  // Prepare knowledge graph data
  const graphNodes = [
    {
      id: law.id,
      title: law.title,
      category: law.category,
      confidenceScore: law.confidenceScore
    },
    ...RELATED_LAWS
  ];

  const graphLinks = [
    {
      source: law.id,
      target: "rel1",
      relationship: "related",
      strength: 0.7
    },
    {
      source: law.id,
      target: "rel2",
      relationship: "related",
      strength: 0.8
    },
    {
      source: law.id,
      target: "rel3",
      relationship: "related",
      strength: 0.6
    }
  ];

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">{law.title}</h1>
            <div className="flex items-center gap-x-4">
              <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                law.confidenceScore >= 0.8 ? 'bg-green-50 text-green-700' :
                law.confidenceScore >= 0.6 ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              }`}>
                {Math.round(law.confidenceScore * 100)}% confidence
              </div>
              <button className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                    <KnowledgeGraph nodes={graphNodes} links={graphLinks} height={400} width={900} />
                  </Suspense>
                </div>
              </div>
              
              {/* Citation Export */}
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Citations</h3>
                <div className="mt-4">
                  <Suspense fallback={<div className="h-[200px] w-full bg-gray-100 animate-pulse rounded-lg"></div>}>
                    <CitationExporter papers={SAMPLE_PAPERS} lawTitle={law.title} />
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
        </div>
      </main>
    </div>
  );
} 