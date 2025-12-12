import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Ghost, History, Layers } from 'lucide-react';
import { getReviews } from '../services/api';
import ReviewCard from './ReviewCard';

// Skeleton Loading yang lebih halus
const ReviewSkeleton = () => (
  <div className="bg-white/80 rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse mb-4">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
        <div>
          <div className="h-4 w-32 bg-slate-100 rounded mb-2"></div>
          <div className="h-3 w-20 bg-slate-50 rounded"></div>
        </div>
      </div>
      <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-slate-50 rounded"></div>
      <div className="h-3 w-5/6 bg-slate-50 rounded"></div>
    </div>
  </div>
);

const ReviewList = ({ refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchReviews = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setIsRefreshing(true);
    
    setError(null);

    try {
      const data = await getReviews(50, 0); 
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    fetchReviews(false); 
  };

  return (
    // Tambahkan px-2 agar scrollbar tidak menempel ke tepi
    <div className="relative h-full flex flex-col px-2">
      
      {/* HEADER SEAMLESS (Menyatu dengan Sidebar) */}
      <div className="flex items-center justify-between py-5 px-2 sticky top-0 z-20 backdrop-blur-xl bg-white/40 rounded-b-2xl mb-2 transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm ring-1 ring-indigo-100/50">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-none tracking-tight">
              Riwayat
            </h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {reviews.length > 0 ? `${reviews.length} Ulasan` : 'Menunggu'}
            </span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="group p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all active:scale-95 disabled:opacity-50"
          title="Segarkan Data"
        >
          <RefreshCw
            size={18}
            className={`transition-all duration-700 ${isRefreshing ? 'animate-spin text-indigo-500' : 'group-hover:rotate-180'}`}
          />
        </button>
      </div>

      {/* LIST CONTENT */}
      {/* pr-2 dan pb-4 memberikan ruang napas untuk shadow card saat hover */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4 custom-scrollbar scroll-smooth">
        
        {loading && (
          <div className="mt-2">
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center mx-1">
            <div className="w-10 h-10 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={20} />
            </div>
            <p className="text-rose-700 text-xs font-medium mb-3">{error}</p>
            <button 
              onClick={() => fetchReviews(true)}
              className="text-xs font-bold text-rose-600 bg-white border border-rose-200 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-slate-200/60 rounded-3xl mx-1 bg-white/30">
            <Ghost size={40} className="text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm text-center font-medium">
              Belum ada data
            </p>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-1">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            
            <div className="flex items-center justify-center gap-2 py-6 opacity-40">
              <Layers size={14} className="text-slate-400" />
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Akhir Daftar
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;