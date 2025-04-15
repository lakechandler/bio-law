'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { laws } from '@/lib/api';
import { Law } from '@/types/law';

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
  
  // State for search form
  const [searchQuery, setSearchQuery] = useState(query);
  const [category, setCategory] = useState(initialCategory);
  const [confidenceLevel, setConfidenceLevel] = useState(initialConfidence);
  
  // State for API results
  const [results, setResults] = useState<Law[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  
  // Fetch search results when URL parameters change
  useEffect(() => {
    const fetchResults = async () => {
      if (!query && category === 'All Categories' && confidenceLevel === 0) {
        // If no search criteria, don't search
        setResults([]);
        setTotalResults(0);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Call the API with the search parameters
        const searchResults = await laws.search(
          query,
          category !== 'All Categories' ? category : undefined
        );
        
        // Filter by confidence if needed
        const filteredResults = confidenceLevel > 0 
          ? searchResults.filter(law => law.confidenceScore >= confidenceLevel)
          : searchResults;
        
        setResults(filteredResults);
        setTotalResults(filteredResults.length);
      } catch (err) {
        console.error('Error searching laws:', err);
        setError('Failed to load search results. Please try again.');
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query, category, confidenceLevel]);
  
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
  
  // Handle sorting changes
  const [sortBy, setSortBy] = useState<'relevance' | 'confidence' | 'date'>('relevance');
  
  // Sort results based on the selected criteria
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'confidence') {
      return b.confidenceScore - a.confidenceScore;
    } else if (sortBy === 'date') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0; // Default: relevance (as returned by API)
  });
  
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
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-900">{results.length}</span> of <span className="font-medium text-gray-900">{totalResults}</span> results for <span className="font-medium text-gray-900">&quot;{query}&quot;</span>
                    {category !== 'All Categories' && (
                      <span> in <span className="font-medium text-gray-900">{category}</span></span>
                    )}
                    {confidenceLevel > 0 && (
                      <span> with confidence ≥ <span className="font-medium text-gray-900">{(confidenceLevel * 100).toFixed(0)}%</span></span>
                    )}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="confidence">Confidence</option>
                    <option value="date">Most Recent</option>
                  </select>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="mt-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">Searching for biology laws...</p>
              </div>
            ) : error ? (
              <div className="mt-8 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                {sortedResults.length > 0 ? (
                  sortedResults.map((result) => (
                    <div key={result.id} className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="px-4 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                              <Link href={`/laws/${result.id}`} className="hover:text-indigo-600">
                                {result.title}
                              </Link>
                            </h3>
                          </div>
                          <div className="flex items-center">
                            <span 
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                result.confidenceScore >= 0.9
                                  ? 'bg-green-100 text-green-800'
                                  : result.confidenceScore >= 0.7
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {Math.round(result.confidenceScore * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{result.description}</p>
                        <div className="mt-4 flex items-center">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {result.category}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            Updated {new Date(result.updatedAt).toLocaleDateString()}
                          </span>
                          <span className="ml-auto">
                            <Link 
                              href={`/laws/${result.id}`}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              View details <span aria-hidden="true">→</span>
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : query ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter criteria to find what you're looking for.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setCategory('All Categories');
                          setConfidenceLevel(0);
                          router.push('/search');
                        }}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900">Start your search</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter keywords above to search the biology laws database.
                    </p>
                    <div className="mt-6">
                      <Link 
                        href="/categories"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Browse by category instead
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 