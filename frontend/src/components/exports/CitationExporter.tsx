'use client';

import { Paper } from "@/types/law";
import { useState } from "react";

interface CitationExporterProps {
  papers: Paper[];
}

export default function CitationExporter({ papers }: CitationExporterProps) {
  const [format, setFormat] = useState<'apa' | 'mla' | 'chicago'>('apa');
  
  // Format citation based on selected style
  const formatCitation = (paper: Paper, style: 'apa' | 'mla' | 'chicago'): string => {
    switch (style) {
      case 'apa':
        return `${paper.authors.join(", ")}. (${new Date(paper.publishDate).getFullYear()}). ${paper.title}. ${paper.source}. https://doi.org/${paper.doi}`;
      case 'mla':
        return `${paper.authors.join(", ")}. "${paper.title}." ${paper.source}, ${new Date(paper.publishDate).getFullYear()}, https://doi.org/${paper.doi}.`;
      case 'chicago':
        return `${paper.authors.join(", ")}. "${paper.title}." ${paper.source} (${new Date(paper.publishDate).getFullYear()}). https://doi.org/${paper.doi}.`;
      default:
        return `${paper.title} - ${paper.doi}`;
    }
  };
  
  const handleCopy = () => {
    const citations = papers.map(paper => formatCitation(paper, format)).join('\n\n');
    navigator.clipboard.writeText(citations)
      .then(() => alert('Citations copied to clipboard!'))
      .catch(err => console.error('Failed to copy citations:', err));
  };
  
  return (
    <div className="flex items-center space-x-2">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as 'apa' | 'mla' | 'chicago')}
        className="block py-1.5 px-3 border border-gray-300 bg-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="apa">APA</option>
        <option value="mla">MLA</option>
        <option value="chicago">Chicago</option>
      </select>
      <button
        onClick={handleCopy}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Export Citations
      </button>
    </div>
  );
} 