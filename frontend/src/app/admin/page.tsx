'use client';

import { useState, useEffect } from 'react';

// Mock monitoring data (in a real app, this would come from the API)
const INITIAL_STATS = {
  papers: {
    total: 0,
    pubmed: 0,
    springer: 0,
    nature: 0,
    lastUpdated: null as Date | null
  },
  laws: {
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    lastUpdated: null as Date | null
  },
  users: {
    total: 0,
    active: 0
  },
  system: {
    jobsRunning: 0,
    jobsCompleted: 0,
    jobsFailed: 0,
    processingQueue: 0
  }
};

export default function AdminPage() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  
  // Simulated data fetching (in a real app, this would be an API call)
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      // Simulate API response
      setStats({
        papers: {
          total: 1245,
          pubmed: 856,
          springer: 325,
          nature: 64,
          lastUpdated: new Date(Date.now() - 3600000) // 1 hour ago
        },
        laws: {
          total: 128,
          published: 98,
          draft: 22,
          archived: 8,
          lastUpdated: new Date(Date.now() - 7200000) // 2 hours ago
        },
        users: {
          total: 342,
          active: 56
        },
        system: {
          jobsRunning: 3,
          jobsCompleted: 128,
          jobsFailed: 2,
          processingQueue: 15
        }
      });
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="py-10">
      <header className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Admin Dashboard</h1>
        </div>
      </header>
      <main>
        {/* Tabs */}
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-4 sm:px-0">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">Select a tab</label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedTab}
                onChange={(e) => setSelectedTab(e.target.value)}
              >
                <option value="dashboard">Dashboard</option>
                <option value="papers">Papers</option>
                <option value="laws">Laws</option>
                <option value="users">Users</option>
                <option value="jobs">Jobs</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setSelectedTab('dashboard')}
                    className={`${
                      selectedTab === 'dashboard'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setSelectedTab('papers')}
                    className={`${
                      selectedTab === 'papers'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Papers
                  </button>
                  <button
                    onClick={() => setSelectedTab('laws')}
                    className={`${
                      selectedTab === 'laws'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Laws
                  </button>
                  <button
                    onClick={() => setSelectedTab('users')}
                    className={`${
                      selectedTab === 'users'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Users
                  </button>
                  <button
                    onClick={() => setSelectedTab('jobs')}
                    className={`${
                      selectedTab === 'jobs'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Jobs
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            {isLoading ? (
              // Loading state
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Dashboard Tab */}
                {selectedTab === 'dashboard' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">System Overview</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Papers</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900">{stats.papers.total.toLocaleString()}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Laws</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900">{stats.laws.total.toLocaleString()}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900">{stats.users.total.toLocaleString()}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Processing Queue</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900">{stats.system.processingQueue.toLocaleString()}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* System Status */}
                    <div className="mt-8">
                      <h2 className="text-lg font-medium text-gray-900">System Status</h2>
                      <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                          <li>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`flex-shrink-0 h-4 w-4 rounded-full ${stats.system.jobsRunning > 0 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                  <p className="ml-3 text-sm font-medium text-gray-900">Data Ingestion Service</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {stats.papers.lastUpdated ? `Last fetched: ${stats.papers.lastUpdated.toLocaleTimeString()}` : 'No data'}
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-400"></div>
                                  <p className="ml-3 text-sm font-medium text-gray-900">NLP Processing Service</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {stats.system.processingQueue} papers in queue
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-400"></div>
                                  <p className="ml-3 text-sm font-medium text-gray-900">Law Extraction Service</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {stats.laws.lastUpdated ? `Last updated: ${stats.laws.lastUpdated.toLocaleTimeString()}` : 'No data'}
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-400"></div>
                                  <p className="ml-3 text-sm font-medium text-gray-900">Notification Service</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  Running
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Papers Tab */}
                {selectedTab === 'papers' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Paper Statistics</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">PubMed Papers</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.papers.pubmed.toLocaleString()}</dd>
                            </div>
                            <div className="text-sm text-gray-500">{((stats.papers.pubmed / stats.papers.total) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Springer Papers</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.papers.springer.toLocaleString()}</dd>
                            </div>
                            <div className="text-sm text-gray-500">{((stats.papers.springer / stats.papers.total) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Nature Papers</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.papers.nature.toLocaleString()}</dd>
                            </div>
                            <div className="text-sm text-gray-500">{((stats.papers.nature / stats.papers.total) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Trigger Paper Fetch
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Laws Tab */}
                {selectedTab === 'laws' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">Law Statistics</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Published Laws</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.laws.published.toLocaleString()}</dd>
                            </div>
                            <div className="text-sm text-gray-500">{((stats.laws.published / stats.laws.total) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Draft Laws</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.laws.draft.toLocaleString()}</dd>
                            </div>
                            <div className="text-sm text-gray-500">{((stats.laws.draft / stats.laws.total) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Archived Laws</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.laws.archived.toLocaleString()}</dd>
                            </div>
                            <div className="text-sm text-gray-500">{((stats.laws.archived / stats.laws.total) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Pending Laws
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Users Tab */}
                {selectedTab === 'users' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">User Statistics</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.users.total.toLocaleString()}</dd>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Active Users (last 24h)</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.users.active.toLocaleString()}</dd>
                            </div>
                            <div className="text-sm text-gray-500">{((stats.users.active / stats.users.total) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Jobs Tab */}
                {selectedTab === 'jobs' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">System Jobs</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Running Jobs</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.system.jobsRunning.toLocaleString()}</dd>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Completed Jobs (24h)</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.system.jobsCompleted.toLocaleString()}</dd>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <dt className="text-sm font-medium text-gray-500 truncate">Failed Jobs (24h)</dt>
                              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.system.jobsFailed.toLocaleString()}</dd>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                      >
                        View Job Logs
                      </button>
                      
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Restart Failed Jobs
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 