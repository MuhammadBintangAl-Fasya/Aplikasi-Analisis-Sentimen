import React, { useState } from 'react';
import { Send, Loader2, AlertCircle, Sparkles, MessageSquare, Tag, AlignLeft } from 'lucide-react';
import { analyzeReview } from '../services/api';

const ReviewForm = ({ onAnalysisComplete }) => {
  const [formData, setFormData] = useState({
    productName: '',
    reviewText: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.productName.trim().length < 1) {
      setError('Mohon isi nama produk terlebih dahulu.');
      return;
    }
    
    if (formData.reviewText.trim().length < 10) {
      setError('Ulasan terlalu singkat. Berikan detail pengalaman Anda.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeReview(
        formData.productName.trim(),
        formData.reviewText.trim()
      );
      if (onAnalysisComplete) onAnalysisComplete(result);
      // Reset form
      setFormData({ productName: '', reviewText: '' });
    } catch (err) {
      setError(err.message || 'Gagal memproses. Coba periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  // Logika Visual Progress Bar
  const charCount = formData.reviewText.length;
  // Warna berubah dinamis: Merah (Pendek) -> Kuning (Sedang) -> Hijau (Bagus)
  const progressColor = charCount < 10 ? 'bg-rose-400' : charCount < 50 ? 'bg-amber-400' : 'bg-emerald-500';
  const progressWidth = Math.min((charCount / 200) * 100, 100);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Background Decor (Blur Effect) */}
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden">
        
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-50/80">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
              <Sparkles size={20} className="fill-indigo-200" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                Analisis Sentimen AI
              </h2>
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed pl-12">
            Tulis ulasan produk di bawah. AI akan mendeteksi sentimen dan memberikan poin penting secara otomatis.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Nama Produk */}
            <div className="group">
              <label 
                htmlFor="productName" 
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5"
              >
                <Tag size={14} />
                Nama Produk / Jasa
              </label>
              <div className={`relative transition-all duration-300 ${focusedField === 'productName' ? 'transform -translate-y-1' : ''}`}>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('productName')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  placeholder="Contoh: iPhone 15 Pro, Layanan Gojek, Sepatu Nike..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Input Text Area Ulasan */}
            <div className="group">
              <div className="flex justify-between items-end mb-2.5">
                <label 
                  htmlFor="reviewText" 
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  <AlignLeft size={14} />
                  Isi Ulasan
                </label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${charCount >= 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  {charCount} KARAKTER
                </span>
              </div>
              
              <div className={`relative transition-all duration-300 ${focusedField === 'reviewText' ? 'transform -translate-y-1' : ''}`}>
                <textarea
                  id="reviewText"
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('reviewText')}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  rows={5}
                  placeholder="Ceritakan pengalaman penggunaan produk. Apa kelebihannya? Apa kekurangannya?"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 resize-none leading-relaxed shadow-sm"
                />
                
                {/* Visual Progress Bar Halus */}
                <div className="absolute bottom-0 left-1 right-1 h-1 bg-slate-200/50 rounded-full overflow-hidden mx-4 mb-0.5 opacity-0 transition-opacity group-focus-within:opacity-100">
                  <div 
                    className={`h-full transition-all duration-500 ease-out rounded-full ${progressColor}`}
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>

              {/* Helper Message / Validasi */}
              {charCount < 10 && charCount > 0 && (
                <p className="text-xs text-rose-500 mt-2 flex items-center gap-1.5 animate-pulse font-medium">
                  <AlertCircle size={14} />
                  Terlalu pendek. Tambahkan sedikit lagi detailnya.
                </p>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="p-1 bg-rose-100 rounded-full text-rose-600 mt-0.5">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-800">Gagal Memproses</h4>
                  <p className="text-sm text-rose-600/90 mt-0.5 leading-snug">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || formData.reviewText.length < 10}
                className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 p-4 text-white shadow-xl shadow-slate-900/10 transition-all duration-300 hover:bg-indigo-600 hover:shadow-indigo-600/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                <div className="relative flex items-center justify-center gap-2.5 font-semibold tracking-wide">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Sedang Menganalisis...</span>
                    </>
                  ) : (
                    <>
                      <span>Mulai Analisis</span>
                      <Send size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </div>
              </button>

              <div className="mt-6 flex items-center justify-center gap-3 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                <span>Powered by Gemini</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>Hugging Face</span>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;