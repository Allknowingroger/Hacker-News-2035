import React from 'react';
import { Story, ViewMode } from '../types';
import { Icons } from '../constants';

interface StoryItemProps {
  story: Story;
  onClick: (story: Story) => void;
  isSelected: boolean;
  viewMode: ViewMode;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, onClick, isSelected, viewMode }) => {
  const getSentimentColor = (sentiment: Story['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      case 'controversial': return 'text-purple-500';
      default: return 'text-hn-dim';
    }
  };

  const getImpactColor = (score: number) => {
    if (score > 80) return 'bg-purple-500';
    if (score > 50) return 'bg-blue-500';
    return 'bg-hn-dim';
  };

  if (viewMode === ViewMode.GRID) {
    return (
      <div 
        onClick={() => onClick(story)}
        className={`
          group relative flex flex-col justify-between p-5 cursor-pointer transition-all duration-300 border border-hn-border rounded-xl bg-hn-bg hover:bg-hn-card/80 hover:border-hn-orange/30 hover:shadow-[0_0_15px_rgba(255,102,0,0.1)]
          ${isSelected ? 'ring-2 ring-hn-orange bg-hn-card' : ''}
        `}
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-mono text-hn-dim bg-hn-border/30 px-2 py-1 rounded">
            {story.domain}
          </span>
          <span className={`text-xs font-mono font-bold ${getSentimentColor(story.sentiment)}`}>
            {story.sentiment}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-hn-text leading-tight group-hover:text-white transition-colors mb-4 line-clamp-3">
          {story.title}
        </h3>

        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-hn-border rounded-full overflow-hidden">
               <div className={`h-full ${getImpactColor(story.impact_score)}`} style={{ width: `${story.impact_score}%` }}></div>
            </div>
            <span className="text-[10px] font-mono text-hn-dim">IMP {story.impact_score}</span>
          </div>
          
          <div className="flex justify-between items-center text-xs text-hn-dim font-mono border-t border-hn-border/50 pt-3">
             <span className="flex items-center gap-1 group-hover:text-hn-orange">
               <Icons.ArrowUp /> {story.points}
             </span>
             <span className="flex items-center gap-1">
               <Icons.MessageSquare /> {story.comments_count}
             </span>
             <span>{story.time_ago}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(story)}
      className={`
        group relative flex items-start gap-3 p-3 sm:p-4 cursor-pointer transition-all duration-200 border-b border-hn-border
        hover:bg-hn-card/50
        ${isSelected ? 'bg-hn-card border-l-4 border-l-hn-orange' : 'border-l-4 border-l-transparent'}
      `}
    >
      {/* Rank */}
      <div className="hidden sm:flex flex-col items-end w-8 pt-1 text-lg font-mono text-hn-dim/50 font-bold group-hover:text-hn-orange transition-colors">
        {story.rank}
      </div>

      {/* Upvote Arrow (Decorative) */}
      <div className="pt-2 text-hn-dim group-hover:text-hn-orange transition-colors">
        <Icons.ArrowUp />
      </div>

      <div className="flex-1 min-w-0">
        {/* Title & Domain */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mb-1">
          <h3 className="text-[15px] sm:text-base font-medium text-hn-text leading-tight group-hover:text-white transition-colors">
            {story.title}
          </h3>
          <span className="text-xs sm:text-sm text-hn-dim font-mono truncate">
            ({story.domain})
          </span>
        </div>

        {/* Metadata Line */}
        <div className="flex flex-wrap items-center text-xs text-hn-dim gap-x-3 gap-y-1 font-mono">
          <span className="font-semibold text-hn-dim group-hover:text-hn-orange">{story.points} points</span>
          <span>by <span className="text-hn-text hover:underline">{story.user}</span></span>
          <span>{story.time_ago}</span>
          <span className="flex items-center gap-1 hover:text-hn-text transition-colors">
             <Icons.MessageSquare /> {story.comments_count}
          </span>
          
          {/* Futuristic Metadata */}
          <span className="hidden sm:inline-block w-px h-3 bg-hn-border mx-1"></span>
          <span className={`flex items-center gap-1 ${getSentimentColor(story.sentiment)}`}>
            {story.sentiment === 'controversial' && <Icons.Zap />}
            {story.sentiment}
          </span>
          <span className="text-blue-400/80">Impact: {story.impact_score}</span>
        </div>
      </div>
    </div>
  );
};

export default StoryItem;