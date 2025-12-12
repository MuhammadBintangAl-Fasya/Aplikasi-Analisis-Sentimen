import React from 'react';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

/**
 * SentimentBadge Component
 * Displays sentiment with color-coded badge and icon
 */
const SentimentBadge = ({ sentiment, score }) => {
  const sentimentConfig = {
    positive: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: CheckCircle,
      label: 'Positive'
    },
    negative: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: XCircle,
      label: 'Negative'
    },
    neutral: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      icon: MinusCircle,
      label: 'Neutral'
    }
  };

  const config = sentimentConfig[sentiment] || sentimentConfig.neutral;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.text} ${config.border} font-medium`}
    >
      <Icon size={20} />
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="text-sm opacity-75">
          ({(score * 100).toFixed(1)}%)
        </span>
      )}
    </div>
  );
};

export default SentimentBadge;
