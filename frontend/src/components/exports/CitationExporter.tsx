'use client';

import { useState } from 'react';

// Citation formats supported
type CitationFormat = 'APA' | 'MLA' | 'Chicago';

// Paper interface for citation generation
interface Paper {
  title: string;
  authors: string[];
  publishDate: string;
  source: string;
  doi?: string | null;
  url?: string | null;
}

interface CitationExporterProps {
  papers: Paper[];
  lawTitle?: string;
}

export default function CitationExporter({ papers, lawTitle }: CitationExporterProps) {
  const [format, setFormat] = useState<CitationFormat>('APA');
  
  // Generate citations based on selected format
  const generateCitations = (papers: Paper[], format: CitationFormat): string[] => {
    return papers.map(paper => {
      switch (format) {
        case 'APA':
          return formatAPA(paper);
        case 'MLA':
          return formatMLA(paper);
        case 'Chicago':
          return formatChicago(paper);
      }
    });
  };
  
  // Format paper in APA style
  const formatAPA = (paper: Paper): string => {
    const authors = formatAuthorsAPA(paper.authors);
    const year = new Date(paper.publishDate).getFullYear();
    const title = paper.title;
    const source = paper.source;
    const doi = paper.doi ? `https://doi.org/${paper.doi}` : paper.url || '';
    
    return `${authors} (${year}). ${title}. ${source}. ${doi}`;
  };
  
  // Format paper in MLA style
  const formatMLA = (paper: Paper): string => {
    const authors = formatAuthorsMLA(paper.authors);
    const title = `"${paper.title}."`;
    const source = paper.source;
    const year = new Date(paper.publishDate).getFullYear();
    const doi = paper.doi ? `https://doi.org/${paper.doi}` : paper.url || '';
    
    return `${authors}. ${title} ${source}, ${year}. ${doi}`;
  };
  
  // Format paper in Chicago style
  const formatChicago = (paper: Paper): string => {
    const authors = formatAuthorsChicago(paper.authors);
    const title = `"${paper.title}."`;
    const source = paper.source;
    const year = new Date(paper.publishDate).getFullYear();
    const doi = paper.doi ? `https://doi.org/${paper.doi}` : paper.url || '';
    
    return `${authors}. ${title} ${source} (${year}). ${doi}`;
  };
  
  // Format authors in APA style
  const formatAuthorsAPA = (authors: string[]): string => {
    if (!authors.length) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors[0]} et al.`;
  };
  
  // Format authors in MLA style
  const formatAuthorsMLA = (authors: string[]): string => {
    if (!authors.length) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors[0]} et al.`;
  };
  
  // Format authors in Chicago style
  const formatAuthorsChicago = (authors: string[]): string => {
    if (!authors.length) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors[0]} et al.`;
  };
  
  // Copy citations to clipboard
  const copyCitations = () => {
    const citations = generateCitations(papers, format).join('\n\n');
    navigator.clipboard.writeText(citations);
  };
  
  // Export citations as a text file
  const downloadCitations = () => {
    const citations = generateCitations(papers, format).join('\n\n');
    const blob = new Blob([citations], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lawTitle || 'biology-law'}-citations-${format.toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const citations = generateCitations(papers, format);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Export Citations</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Citation Format
        </label>
        <div className="flex space-x-2">
          {(['APA', 'MLA', 'Chicago'] as CitationFormat[]).map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-md text-sm ${
                format === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFormat(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-md p-4 mb-4 max-h-60 overflow-y-auto">
        {citations.length > 0 ? (
          <ul className="space-y-3">
            {citations.map((citation, index) => (
              <li key={index} className="text-sm text-gray-700">
                {citation}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No citations available</p>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={copyCitations}
          className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700"
          disabled={citations.length === 0}
        >
          Copy to Clipboard
        </button>
        <button
          onClick={downloadCitations}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-500"
          disabled={citations.length === 0}
        >
          Download
        </button>
      </div>
    </div>
  );
} 