import { Law } from "@/types/law";
import { Suspense } from "react";
import { LawDetails } from '@/components/LawDetails';

// Sample graph data (in a real app, fetch this from API)
const GRAPH_DATA = {
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
  // In a real app, fetch this from your API
  return {
    id,
    title: "ATP Production in Mitochondria",
    description: "The process of ATP production in mitochondria follows the chemiosmotic theory, where the electron transport chain generates a proton gradient across the inner mitochondrial membrane, driving ATP synthesis through ATP synthase.",
    category: "Cell Biology",
    tags: ["Mitochondria", "ATP", "Energy Metabolism", "Cellular Respiration"],
    supportingPapers: [
      "10.1038/s41586-021-03819-2",
      "10.1016/j.cell.2021.05.021"
    ],
    contradictingPapers: [],
    updatedAt: "2024-03-15T12:00:00Z",
    publishedAt: "2024-03-01T00:00:00Z"
  };
}

export default async function LawPage({ params }: { params: { id: string } }) {
  const law = await getLaw(params.id);
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-8">
          {law.title}
        </h1>
        <Suspense fallback={<div>Loading law details...</div>}>
          <LawDetails 
            law={law}
            graphData={GRAPH_DATA}
            papers={SAMPLE_PAPERS}
          />
        </Suspense>
      </div>
    </div>
  );
} 