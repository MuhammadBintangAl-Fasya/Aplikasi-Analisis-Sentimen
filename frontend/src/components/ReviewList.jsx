import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, AlertTriangle, Package } from 'lucide-react';
import { getReviews } from '../services/api';
import ReviewCard from './ReviewCard';

/**
 * ReviewList Component
 * Displays list of all analyzed reviews
 */
const ReviewList = ({ refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reviews from API
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getReviews(50, 0); // Get latest 50 reviews
      setReviews(data.reviews || []);
      console.log(`Loaded ${data.total} reviews`);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when refreshTrigger changes
  useEffect(() => {
    fetchReviews();
  }, [refreshTrigger]);

  // Manual refresh button handler
  const handleRefresh = () => {
    fetchReviews();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          📊 Previous Reviews
          {reviews.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({reviews.length})
            </span>
          )}
        </h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh reviews"
        >
          <RefreshCw
            size={20}
            className={loading ? 'animate-spin' : ''}
          />
        </button>
      </div>

      {/* Loading State */}
      {loading && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Loader2 className="animate-spin mb-3" size={32} />
          <p className="text-sm">Loading reviews...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <p className="text-red-800 font-medium mb-1">Failed to load reviews</p>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Package size={48} className="mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No reviews yet</p>
          <p className="text-sm text-gray-400">
            Analyze your first review to see it here!
          </p>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
