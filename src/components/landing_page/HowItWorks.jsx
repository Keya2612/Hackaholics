// components/HowItWorks.js
export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Learning Phase",
      description: "Start with guided learning modules covering aptitude tests, group discussions, and personal interviews.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Practice Tests",
      description: "Take separate practice tests for aptitude, GD, and interview skills to assess your readiness.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Full Simulation",
      description: "Experience a complete end-to-end interview process with our AI-powered simulation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      )
    },
    {
      number: "04",
      title: "Personalized Feedback",
      description: "Receive comprehensive analysis of your performance with specific areas for improvement.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];
  
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How InterviewAI Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our structured approach ensures you're fully prepared for every stage of the interview process
          </p>
        </div>
        
        {/* Mobile view - vertical steps */}
        <div className="md:hidden max-w-md mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="mb-12 last:mb-6 relative">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-24 bg-indigo-200 mx-auto mt-2"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Connection back to first step */}
          <div className="flex justify-center">
            <div className="w-1/2 h-0.5 bg-indigo-200 mb-4"></div>
          </div>
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 rounded-full p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <p className="text-center text-indigo-600 font-medium">Continuous improvement cycle</p>
        </div>
        
        {/* Desktop view - circular steps */}
        <div className="hidden md:block">
          <div className="relative max-w-4xl mx-auto">
            {/* Circle background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[550px] h-[550px] rounded-full border-4 border-dashed border-indigo-100"></div>
            </div>
            
            {/* Circular connector */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[570px] h-[570px] rounded-full border-2 border-indigo-200"></div>
            </div>
            
            {/* Center piece */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-48 h-48 rounded-full bg-white shadow-lg border border-indigo-100 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900">Continuous</h4>
                  <p className="text-sm text-gray-600">Improvement Cycle</p>
                </div>
              </div>
            </div>
            
            {/* Step cards positioned on the circle */}
            {/* Step 1 - top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-2">
              <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-56">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-3 mx-auto">
                  {steps[0].number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{steps[0].title}</h3>
                <p className="text-gray-600 text-center text-xs">{steps[0].description}</p>
              </div>
            </div>
            
            {/* Step 2 - right */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -translate-x-2">
              <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-56">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-3 mx-auto">
                  {steps[1].number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{steps[1].title}</h3>
                <p className="text-gray-600 text-center text-xs">{steps[1].description}</p>
              </div>
            </div>
            
            {/* Step 3 - bottom */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-56">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-3 mx-auto">
                  {steps[2].number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{steps[2].title}</h3>
                <p className="text-gray-600 text-center text-xs">{steps[2].description}</p>
              </div>
            </div>
            
            {/* Step 4 - left */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 translate-x-2">
              <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 w-56">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-3 mx-auto">
                  {steps[3].number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{steps[3].title}</h3>
                <p className="text-gray-600 text-center text-xs">{steps[3].description}</p>
              </div>
            </div>
            
            
            {/* Space for the circle */}
            <div className="w-full h-[650px]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}