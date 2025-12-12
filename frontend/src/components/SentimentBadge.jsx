import React from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

/**
 * SentimentBadge Component - Data Analyst Style
 * Menampilkan sentimen sebagai metrik data, bukan sekadar label.
 */
const SentimentBadge = ({ sentiment, score }) => {
  
  // Normalisasi input (handle huruf besar/kecil)
  const normalizedSentiment = sentiment?.toLowerCase() || 'neutral';

  const config = {
    positive: {
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      ring: 'ring-emerald-500/20',
      icon: TrendingUp,
      label: 'Positif',
      gradient: 'from-emerald-500 to-teal-500' // Untuk bar indikator
    },
    negative: {
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      ring: 'ring-rose-500/20',
      icon: TrendingDown,
      label: 'Negatif',
      gradient: 'from-rose-500 to-red-500'
    },
    neutral: {
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      ring: 'ring-slate-500/20',
      icon: Minus,
      label: 'Netral',
      gradient: 'from-slate-400 to-slate-500'
    }
  };

  // Fallback ke neutral jika data aneh
  const style = config[normalizedSentiment] || config.neutral;
  const Icon = style.icon;
  
  // Format persentase (misal: 0.9432 -> 94%)
  const percentage = score !== undefined ? Math.round(score * 100) : 0;

  return (
    <div 
      className={`
        inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg 
        border ${style.bg} ${style.border} shadow-sm 
        transition-all duration-300 hover:shadow-md
      `}
    >
      {/* Icon Container */}
      <div className={`
        flex items-center justify-center w-5 h-5 rounded-md bg-white 
        shadow-sm border border-white/50 ${style.color}
      `}>
        <Icon size={14} strokeWidth={2.5} />
      </div>

      {/* Text Label */}
      <span className={`text-xs font-bold uppercase tracking-wider ${style.color}`}>
        {style.label}
      </span>

      {/* Vertical Divider */}
      <div className={`w-px h-3.5 ${style.border.replace('border', 'bg')}`}></div>

      {/* Score Indicator */}
      {score !== undefined && (
        <div className="flex items-center gap-1.5">
          {/* Mini Progress Bar visual */}
          <div className="w-8 h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${style.gradient}`} 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          {/* Percentage Number */}
          <span className={`text-xs font-mono font-semibold tabular-nums ${style.color}`}>
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
};

export default SentimentBadge;