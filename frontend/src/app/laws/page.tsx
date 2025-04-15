import { Law } from "@/types/law";

async function getLaws(): Promise<Law[]> {
  // TODO: Replace with actual API call
  return [
    {
      id: "1",
      title: "Cellular Respiration ATP Production",
      description: "The process of cellular respiration produces 36-38 ATP molecules per glucose molecule under optimal conditions.",
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
    },
    // Add more mock laws here
  ];
}

export default async function LawsPage() {
  const laws = await getLaws();

  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Biology Laws</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Search and filters */}
          <div className="px-4 py-8 sm:px-0">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search biology laws..."
              />
            </div>
          </div>

          {/* Laws grid */}
          <div className="px-4 py-8 sm:px-0">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {laws.map((law) => (
                <div
                  key={law.id}
                  className="relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-x-3">
                      <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        law.confidenceScore >= 0.8 ? 'bg-green-50 text-green-700' :
                        law.confidenceScore >= 0.6 ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {Math.round(law.confidenceScore * 100)}% confidence
                      </div>
                      <p className="text-sm text-gray-500">{law.category}</p>
                    </div>
                    <div className="mt-4 block">
                      <p className="text-xl font-semibold text-gray-900">{law.title}</p>
                      <p className="mt-3 text-base text-gray-500">{law.description}</p>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {law.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex border-t border-gray-200 divide-x divide-gray-200">
                    <a
                      href={`/laws/${law.id}`}
                      className="flex flex-1 items-center justify-center gap-x-2.5 p-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      View details
                    </a>
                    <button
                      className="flex flex-1 items-center justify-center gap-x-2.5 p-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                      </svg>
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 