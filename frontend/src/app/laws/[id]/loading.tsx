export default function Loading() {
  return (
    <div className="py-10 animate-pulse">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-x-4">
              <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
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
                  <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
                  <div className="h-6 w-28 bg-gray-200 rounded-md"></div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="ml-3">
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="ml-3">
                      <div className="h-4 w-56 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div>•</div>
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 