export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-indigo-400">InterviewAI</span>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            AI-powered interview preparation platform to help you land your dream job
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
          <div>
            <h4 className="font-medium mb-4 text-indigo-300">Platform</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-indigo-300 transition">Learning Phase</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition">Simulation</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-indigo-300">Company</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-indigo-300 transition">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-indigo-300">Resources</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#" className="hover:text-indigo-300 transition">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition">Guides</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-indigo-300">Follow Us</h4>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-300 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-300 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-300 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.265.07 1.645.07 4.849 0 1.366-.062 2.633-.326 3.608-1.301.975-.975 1.24-2.242 1.301-3.608.058-1.265.07-1.645.07-4.849s-.012-3.584-.07-4.849c-.062-1.366-.326-2.633-1.301-3.608-.975-.975-2.242-1.24-3.608-1.301C15.584 2.175 15.204 2.163 12 2.163zm0-2.163c3.259 0 3.668.014 4.948.072 1.425.064 2.818.362 3.905 1.449S22.3 4.34 22.364 5.765c.058 1.28.072 1.689.072 4.948s-.014 3.668-.072 4.948c-.064 1.425-.362 2.818-1.449 3.905S17.58 22.3 16.155 22.364c-1.28.058-1.689.072-4.948.072s-3.668-.014-4.948-.072c-1.425-.064-2.818-.362-3.905-1.449S1.7 17.58 1.636 16.155c-.058-1.28-.072-1.689-.072-4.948s.014-3.668.072-4.948c.064-1.425.362-2.818 1.449-3.905S6.42 1.7 7.845 1.636c1.28-.058 1.689-.072 4.948-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-300 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="hover:text-indigo-300 transition mx-2">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-indigo-300 transition mx-2">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}