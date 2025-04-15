'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Mock data for search results (in a real application, these would come from the API)
const MOCK_SEARCH_RESULTS = [
  {
    id: '1',
    title: 'Cellular Respiration ATP Production',
    description: 'The process of cellular respiration produces 36-38 ATP molecules per glucose molecule under optimal conditions.',
    confidenceScore: 0.95,
    category: 'Cellular Biology',
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Mitochondrial Function',
    description: 'Mitochondria are the primary site of ATP production in eukaryotic cells through oxidative phosphorylation.',
    confidenceScore: 0.92,
    category: 'Cell Biology',
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '3',
    title: 'Glycolysis Energy Yield',
    description: 'Glycolysis produces a net gain of 2 ATP molecules per glucose molecule in both aerobic and anaerobic conditions.',
    confidenceScore: 0.97,
    category: 'Biochemistry',
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '4',
    title: 'Photosynthesis Light Reactions',
    description: 'The light-dependent reactions of photosynthesis convert light energy to chemical energy in the form of ATP and NADPH.',
    confidenceScore: 0.89,
    category: 'Plant Biology',
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '5',
    title: 'DNA Replication Fidelity',
    description: 'DNA polymerase has proofreading capability that results in an error rate of approximately 1 in 10^9 base pairs.',
    confidenceScore: 0.91,
    category: 'Molecular Biology',
    updatedAt: new Date('2024-02-20')
  }
];

// Categories for filtering
const CATEGORIES = [
  'All Categories',
  'Biochemistry',
  'Cell Biology',
  'Molecular Biology',
  'Plant Biology',
  'Genetics',
  'Immunology',
  'Neurobiology'
];

// Confidence level options
const CONFIDENCE_LEVELS = [
  { label: 'Any confidence', value: 0 },
  { label: 'High confidence (80%+)', value: 0.8 },
  { label: 'Very high confidence (90%+)', value: 0.9 },
  { label: 'Extremely high confidence (95%+)', value: 0.95 }
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get search parameters from URL
  const query = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All Categories';
  const initialConfidence = parseFloat(searchParams.get('confidence') || '0');
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState(query);
  const [category, setCategory] = useState(initialCategory);
  const [confidenceLevel, setConfidenceLevel] = useState(initialConfidence);
  
  // Filter results based on current filters
  const filteredResults = MOCK_SEARCH_RESULTS.filter(result => {
    // Filter by search term
    const matchesSearch = query === '' || 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase());
    
    // Filter by category
    const matchesCategory = category === 'All Categories' || result.category === category;
    
    // Filter by confidence
    const matchesConfidence = result.confidenceScore >= confidenceLevel;
    
    return matchesSearch && matchesCategory && matchesConfidence;
  });
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (category !== 'All Categories') params.set('category', category);
    if (confidenceLevel > 0) params.set('confidence', confidenceLevel.toString());
    
    router.push(`/search?${params.toString()}`);
  };
  
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Search Biology Laws</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-b border-gray-200 pb-5">
              <form onSubmit={handleSearch} className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Search for biology laws..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <label htmlFor="category" className="sr-only">Category</label>
                  <select
                    id="category"
                    name="category"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-auto">
                  <label htmlFor="confidence" className="sr-only">Confidence Level</label>
                  <select
                    id="confidence"
                    name="confidence"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
                  >
                    {CONFIDENCE_LEVELS.map((level) => (
                      <option key={level.label} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Search
                </button>
              </form>
            </div>
            
            {query && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Showing results for <span className="font-medium text-gray-900">&quot;{query}&quot;</span>
                  {category !== 'All Categories' && (
                    <span> in <span className="font-medium text-gray-900">{category}</span></span>
                  )}
                  {confidenceLevel > 0 && (
                    <span> with confidence ≥ <span className="font-medium text-gray-900">{(confidenceLevel * 100).toFixed(0)}%</span></span>
                  )}
                </p>
              </div>
            )}
            
            <div className="mt-8 space-y-6">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <div key={result.id} className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            <Link href={`/laws/${result.id}`} className="hover:text-indigo-600">
                              {result.title}
                            </Link>
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">{result.category}</p>
                        </div>
                        <div className={`rounded-full px-3 py-1 text-sm font-medium ${
                          result.confidenceScore >= 0.95 ? 'bg-green-100 text-green-800' :
                          result.confidenceScore >= 0.8 ? 'bg-green-50 text-green-700' :
                          result.confidenceScore >= 0.6 ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {Math.round(result.confidenceScore * 100)}% confidence
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">{result.description}</p>
                      <div className="mt-4 flex items-center text-xs text-gray-500">
                        <span>Last updated {result.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 