import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Ghost, History, Layers } from 'lucide-react';
import { getReviews } from '../services/api';
import ReviewCard from './ReviewCard';

/**
 * Komponen Skeleton untuk efek loading yang cantik
 */
const ReviewSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
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
      <div className="h-3 w-4/6 bg-slate-50 rounded"></div>
    </div>
  </div>
);

/**
 * ReviewList Component - Premium Redesign
 */
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
    fetchReviews(false); // Refresh tanpa skeleton penuh, hanya spin icon
  };

  return (
    <div className="relative h-full flex flex-col">
      
      {/* Header Section dengan Glass Effect */}
      <div className="flex items-center justify-between mb-6 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-100/50 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm ring-1 ring-indigo-100">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-none">
              Riwayat Analisis
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {reviews.length > 0 ? `${reviews.length} ulasan tersimpan` : 'Menunggu data'}
            </span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="group p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm disabled:opacity-50"
          title="Segarkan Data"
        >
          <RefreshCw
            size={18}
            className={`transition-all duration-700 ${isRefreshing ? 'animate-spin text-indigo-500' : 'group-hover:rotate-180'}`}
          />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 pb-4 space-y-5 custom-scrollbar scroll-smooth">
        
        {/* State: Loading (Skeleton) */}
        {loading && (
          <>
            <ReviewSkeleton />
            <ReviewSkeleton />
            <ReviewSkeleton />
          </>
        )}

        {/* State: Error */}
        {error && !loading && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-slate-800 font-bold text-sm mb-1">Gagal Memuat</h3>
            <p className="text-rose-600/80 text-xs mb-4">{error}</p>
            <button 
              onClick={() => fetchReviews(true)}
              className="text-xs font-bold text-rose-600 bg-white border border-rose-200 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* State: Empty */}
        {!loading && !error && reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-20"></div>
              <Ghost size={48} className="text-slate-300 relative z-10" />
            </div>
            <p className="text-slate-900 font-bold text-base mb-1">Belum Ada Ulasan</p>
            <p className="text-slate-400 text-sm text-center max-w-[200px] leading-relaxed">
              Analisis ulasan pertama Anda di formulir sebelah kiri untuk melihat hasilnya di sini.
            </p>
          </div>
        )}

        {/* State: Data Loaded */}
        {!loading && !error && reviews.length > 0 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            
            <div className="flex items-center justify-center gap-2 py-4 opacity-40">
              <Layers size={14} className="text-slate-400" />
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
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