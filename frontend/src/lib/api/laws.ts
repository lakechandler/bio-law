import { Law } from "@/types/law";

// In a real app, this would fetch from your API
export async function getLawById(id: string): Promise<Law> {
  // Mock data for development
  return {
    id,
    title: "ATP Production in Mitochondria",
    summary: "The process of ATP production in mitochondria follows the chemiosmotic theory.",
    description: "The process of ATP production in mitochondria follows the chemiosmotic theory, where the electron transport chain generates a proton gradient across the inner mitochondrial membrane, driving ATP synthesis through ATP synthase.",
    category: "Cell Biology",
    tags: ["Mitochondria", "ATP", "Energy Metabolism", "Cellular Respiration"],
    supportingPapers: [
      "10.1038/s41586-021-03819-2",
      "10.1016/j.cell.2021.05.021"
    ],
    contradictingPapers: [],
    updatedAt: "2024-03-15T12:00:00Z",
    publishedAt: "2024-03-01T00:00:00Z",
    confidenceScore: 0.95
  };
}

// Get related laws
export async function getRelatedLaws(id: string): Promise<Law[]> {
  // Mock data for development
  return [
    {
      id: "rel1",
      title: "Mitochondrial Membrane Potential",
      summary: "The mitochondrial membrane potential is essential for ATP production.",
      description: "The mitochondrial membrane potential is maintained by the electron transport chain and is essential for ATP production.",
      category: "Cell Biology",
      tags: ["Mitochondria", "Membrane Potential"],
      supportingPapers: ["10.1038/s41586-021-03819-2"],
      contradictingPapers: [],
      updatedAt: "2024-02-15T12:00:00Z",
      publishedAt: "2024-02-01T00:00:00Z",
      confidenceScore: 0.85
    },
    {
      id: "rel2",
      title: "Glycolysis Energy Yield",
      summary: "Glycolysis produces a net gain of 2 ATP molecules per glucose molecule.",
      description: "Glycolysis is the metabolic pathway that converts glucose into pyruvate, producing a net gain of 2 ATP molecules per glucose molecule.",
      category: "Biochemistry",
      tags: ["Glycolysis", "ATP", "Energy Metabolism"],
      supportingPapers: ["10.1016/j.cell.2021.05.021"],
      contradictingPapers: [],
      updatedAt: "2024-01-20T12:00:00Z",
      publishedAt: "2024-01-05T00:00:00Z",
      confidenceScore: 0.92
    }
  ];
} 