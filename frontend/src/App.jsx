import React, { useState } from 'react';
import { TrendingUp, Sparkles, CheckCircle } from 'lucide-react';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import ReviewCard from './components/ReviewCard';
import './App.css';

function App() {
  const [latestResult, setLatestResult] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle when analysis is completed
  const handleAnalysisComplete = (result) => {
    console.log('New analysis result:', result);
    
    // Set latest result to display
    setLatestResult(result);
    
    // Trigger refresh of review list
    setRefreshTrigger(prev => prev + 1);
    
    // Auto-hide result after 10 seconds
    setTimeout(() => {
      setLatestResult(null);
    }, 10000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <TrendingUp className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Product Review Analyzer
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  AI-powered sentiment analysis & insights extraction
                </p>
              </div>
            </div>
            
            {/* Badges */}
            <div className="hidden md:flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                <Sparkles size={14} />
                AI Powered
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                React + FastAPI
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <ReviewForm onAnalysisComplete={handleAnalysisComplete} />
            
            {/* Latest Result Display */}
            {latestResult && (
              <div className="animate-fadeIn">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                    <CheckCircle size={20} />
                    <span>Analysis Complete!</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    ✨ Latest Analysis Result
                  </h3>
                  <ReviewCard review={latestResult} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Reviews List */}
          <div>
            <ReviewList refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Stats Section (Optional) */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">AI Analysis</p>
                <p className="text-sm text-gray-600">Powered by Hugging Face & Gemini</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Sentiment Detection</p>
                <p className="text-sm text-gray-600">Positive, Negative, Neutral</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Sparkles className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Key Insights</p>
                <p className="text-sm text-gray-600">Auto-extracted points</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Built with ❤️ using React, FastAPI, Hugging Face & Google Gemini
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                API Docs
              </a>
              <span>•</span>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
