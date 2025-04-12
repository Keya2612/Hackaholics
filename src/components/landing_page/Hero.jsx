export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Master Your Interview Skills With <span className="text-indigo-600">AI Simulation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-md">
              Prepare for your dream job with our comprehensive AI interview simulator. Practice, learn, and perfect your skills from aptitude tests to personal interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition text-lg">
                Start Free Trial
              </button>
              <button className="px-8 py-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-200 rounded-lg transform translate-x-6 translate-y-6"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-xl border border-gray-200">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <h3 className="text-gray-800 font-medium mb-2">AI Interview in Progress</h3>
                  <div className="bg-white p-3 rounded-md">
                    <p className="text-gray-600 mb-2">Interviewer:</p>
                    <p className="bg-indigo-50 p-2 rounded-md text-gray-800 mb-3">
                      Tell me about a challenging project you've worked on.
                    </p>
                    <p className="text-gray-600 mb-2">You:</p>
                    <div className="bg-gray-50 p-2 rounded-md text-gray-800 flex items-center">
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-500">AI analysis in progress</span>
                  </div>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Personal Interview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}