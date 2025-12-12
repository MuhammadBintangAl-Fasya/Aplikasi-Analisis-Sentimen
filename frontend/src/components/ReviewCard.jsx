import React from 'react';
import { Calendar, Quote, Sparkles, Box, CheckCircle2 } from 'lucide-react';
import SentimentBadge from './SentimentBadge';

/**
 * ReviewCard Component - Premium Redesign
 * Menampilkan hasil analisis dengan gaya Dashboard Widget
 */
const ReviewCard = ({ review }) => {
  
  // Format tanggal ke Indonesia
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Tentukan warna tema berdasarkan sentimen
  const getThemeColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'positive': return 'emerald';
      case 'negative': return 'rose';
      default: return 'slate';
    }
  };

  const theme = getThemeColor(review.sentiment);

  // Mapping class warna Tailwind dinamis
  const borderClass = {
    emerald: 'border-t-emerald-500',
    rose: 'border-t-rose-500',
    slate: 'border-t-slate-500'
  };

  const bgIconClass = {
    emerald: 'bg-emerald-100 text-emerald-600',
    rose: 'bg-rose-100 text-rose-600',
    slate: 'bg-slate-100 text-slate-600'
  };

  return (
    <div className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-100 border-t-[6px] ${borderClass[theme]}`}>
      
      <div className="p-6">
        {/* Header: Product & Badge */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${bgIconClass[theme]}`}>
              <Box size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                {review.product_name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                <Calendar size={12} />
                {formatDate(review.created_at)}
              </p>
            </div>
          </div>
          <SentimentBadge
            sentiment={review.sentiment}
            score={review.sentiment_score}
          />
        </div>

        {/* Section 1: User Voice (Review Asli) */}
        <div className="relative mb-6">
          <div className="absolute -top-2 -left-2 text-slate-200">
            <Quote size={24} fill="currentColor" className="opacity-50" />
          </div>
          <div className="relative pl-6 py-1">
            <p className="text-slate-600 text-sm leading-relaxed italic font-medium line-clamp-4">
              "{review.review_text}"
            </p>
          </div>
        </div>

        {/* Section 2: AI Insights (Key Points) */}
        {review.key_points && review.key_points.length > 0 && (
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-indigo-500 fill-indigo-500/20" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Poin Kunci AI
              </h4>
            </div>
            
            <div className="space-y-2.5">
              {review.key_points.map((point, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2.5 group/point"
                >
                  <CheckCircle2 
                    size={16} 
                    className={`mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                      theme === 'emerald' ? 'text-emerald-500' : 
                      theme === 'rose' ? 'text-rose-500' : 'text-slate-500'
                    }`} 
                  />
                  <span className="text-sm text-slate-700 leading-snug group-hover/point:text-slate-900 transition-colors">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Decorative Footer Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-50"></div>
    </div>
  );
};

export default ReviewCard;