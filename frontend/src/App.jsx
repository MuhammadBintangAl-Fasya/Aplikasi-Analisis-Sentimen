import React, { useState } from 'react';
import { BrainCircuit, Zap, Activity, CheckCircle2, Github, LayoutDashboard } from 'lucide-react';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import ReviewCard from './components/ReviewCard';
import './App.css';

function App() {
  const [latestResult, setLatestResult] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle saat analisis selesai
  const handleAnalysisComplete = (result) => {
    setLatestResult(result);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-dot-pattern relative selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Decorative Gradient Blobs (Background) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header (Sticky Glass) */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                <BrainCircuit className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                  Sentimen<span className="text-indigo-600">AI</span>
                </h1>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-1">
                  Analisis Ulasan oleh AI
                </p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-emerald-700">Sistem Online</span>
              </div>
              <a 
                href="https://github.com/MuhammadBintangAl-Fasya/Aplikasi-Analisis-Sentimen" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Input & Latest Result) - Takes 7 Columns */}
          <div className="lg:col-span-7 space-y-8">
            <ReviewForm onAnalysisComplete={handleAnalysisComplete} />
            
            {/* Latest Result Animation Section */}
            {latestResult && (
              <div className="animate-slide-up">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1.5 border border-emerald-200 shadow-sm">
                    <CheckCircle2 size={12} />
                    ANALISIS SELESAI
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
                </div>
                
                <div className="relative">
                  {/* Efek Glow di belakang kartu hasil */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-xl transform scale-95 translate-y-2 opacity-50"></div>
                  <ReviewCard review={latestResult} />
                </div>
              </div>
            )}

            {/* Feature/Stats Grid (Di bawah form) */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon: Zap, label: "Kecepatan", value: "< 2 Detik", color: "text-amber-500", bg: "bg-amber-50" },
                { icon: BrainCircuit, label: "Model AI", value: "Gemini Pro", color: "text-indigo-500", bg: "bg-indigo-50" },
                { icon: LayoutDashboard, label: "Akurasi", value: "94.5%", color: "text-emerald-500", bg: "bg-emerald-50" },
              ].map((stat, idx) => (
                <div key={idx} className="stats-card bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                    <stat.icon size={18} />
                  </div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className="text-slate-800 font-bold text-sm lg:text-base">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (History List) - Takes 5 Columns */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 h-[calc(100vh-8rem)]">
            {/* Container ini mengisi sisa tinggi layar agar scrollable mandiri */}
            <div className="h-full bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 p-1">
              <ReviewList refreshTrigger={refreshTrigger} />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
           <Activity size={16} className="text-indigo-500 animate-pulse" />
           <span className="text-sm font-bold text-slate-700">Project Pengolahan Web</span>
        </div>
        <p className="text-xs text-slate-400">
          Ditenagai oleh Pyramid Framework & React Vite
        </p>
      </footer>
    </div>
  );
}

export default App;