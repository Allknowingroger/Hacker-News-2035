import React, { useEffect, useState } from 'react';
import { Story, NeuralAnalysis, Comment } from '../types';
import { analyzeStory, fetchDiscussion } from '../services/geminiService';
import { Icons } from '../constants';

interface NeuralPanelProps {
  story: Story | null;
  onClose: () => void;
}

type Tab = 'analysis' | 'discussion';

const NeuralPanel: React.FC<NeuralPanelProps> = ({ story, onClose }) => {
  const [analysis, setAnalysis] = useState<NeuralAnalysis | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('analysis');

  useEffect(() => {
    if (story) {
      // Reset state
      setAnalysis(null);
      setComments([]);
      setActiveTab('analysis');
      
      // Load Analysis
      setLoadingAnalysis(true);
      analyzeStory(story.title)
        .then(data => {
          setAnalysis(data);
          setLoadingAnalysis(false);
        })
        .catch(() => setLoadingAnalysis(false));

      // Load Comments (lazy load can be done, but pre-fetch is nicer for demo)
      setLoadingComments(true);
      fetchDiscussion(story.title)
        .then(data => {
            setComments(data);
            setLoadingComments(false);
        })
        .catch(() => setLoadingComments(false));
    }
  }, [story]);

  if (!story) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-hn-bg/95 backdrop-blur-md border-l border-hn-border shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
      <div className="flex flex-col min-h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <div className="flex items-center gap-2 text-hn-orange font-mono text-sm tracking-wider uppercase">
            <Icons.Cpu />
            <span>Neural Context</span>
          </div>
          <button onClick={onClose} className="text-hn-dim hover:text-white transition-colors">
            <Icons.X />
          </button>
        </div>

        {/* Story Title */}
        <div className="px-6 pb-6 border-b border-hn-border">
            <h2 className="text-lg font-bold text-white mb-2 leading-snug">{story.title}</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-hn-dim">
              <span className="bg-hn-border px-2 py-0.5 rounded">{story.domain}</span>
              <span>Impact: {story.impact_score}</span>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-hn-border">
            <button 
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-3 text-xs font-mono uppercase tracking-wide transition-colors ${activeTab === 'analysis' ? 'text-hn-orange border-b-2 border-hn-orange bg-hn-orange/5' : 'text-hn-dim hover:text-white'}`}
            >
                Analysis
            </button>
            <button 
                onClick={() => setActiveTab('discussion')}
                className={`flex-1 py-3 text-xs font-mono uppercase tracking-wide transition-colors ${activeTab === 'discussion' ? 'text-hn-orange border-b-2 border-hn-orange bg-hn-orange/5' : 'text-hn-dim hover:text-white'}`}
            >
                Discussion ({loadingComments ? '...' : comments.length})
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 space-y-6">
          
          {activeTab === 'analysis' && (
             <>
                {loadingAnalysis ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-hn-border rounded w-3/4"></div>
                        <div className="h-4 bg-hn-border rounded w-full"></div>
                        <div className="h-4 bg-hn-border rounded w-5/6"></div>
                        <div className="h-20 bg-hn-border rounded w-full mt-4"></div>
                    </div>
                ) : analysis ? (
                    <>
                    {/* Summary */}
                    <div className="bg-hn-card border border-hn-border rounded-lg p-4">
                        <h3 className="text-xs text-hn-dim font-mono uppercase mb-2">Synthesis</h3>
                        <p className="text-sm text-hn-text leading-relaxed">
                        {analysis.summary}
                        </p>
                    </div>

                    {/* Truth Probability */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono text-hn-dim">
                        <span>Fact Verification</span>
                        <span className={analysis.factCheckProbability > 80 ? 'text-green-500' : 'text-yellow-500'}>
                            {analysis.factCheckProbability}% Verified
                        </span>
                        </div>
                        <div className="h-1 bg-hn-border rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${analysis.factCheckProbability > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${analysis.factCheckProbability}%` }}
                        />
                        </div>
                    </div>

                    {/* Bull/Bear Case */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-3 rounded border border-green-900/30 bg-green-900/10">
                        <span className="text-xs text-green-500 font-mono block mb-1">BULL CASE</span>
                        <p className="text-xs text-green-100/80">{analysis.bullCase}</p>
                        </div>
                        <div className="p-3 rounded border border-red-900/30 bg-red-900/10">
                        <span className="text-xs text-red-500 font-mono block mb-1">BEAR CASE</span>
                        <p className="text-xs text-red-100/80">{analysis.bearCase}</p>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {analysis.relatedTopics.map(topic => (
                        <span key={topic} className="text-xs font-mono text-blue-400 bg-blue-900/20 px-2 py-1 rounded-full border border-blue-900/50">
                            #{topic}
                        </span>
                        ))}
                    </div>
                    </>
                ) : (
                    <div className="text-center text-hn-dim py-10">
                        <p>Analysis unavailable.</p>
                    </div>
                )}
             </>
          )}

          {activeTab === 'discussion' && (
             <>
                {loadingComments ? (
                     <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex gap-3">
                                <div className="w-8 h-8 rounded bg-hn-border"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-hn-border rounded w-1/3"></div>
                                    <div className="h-3 bg-hn-border rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                     </div>
                ) : comments.length > 0 ? (
                    <div className="space-y-6">
                        {comments.map(comment => (
                            <div key={comment.id} className={`flex gap-3 ${comment.indent_level > 0 ? 'ml-8' : ''}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${comment.is_ai ? 'bg-purple-900 text-purple-200' : 'bg-hn-border text-hn-dim'}`}>
                                    {comment.is_ai ? <Icons.Bot /> : comment.user.substring(0, 1).toUpperCase()}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold ${comment.is_ai ? 'text-purple-400' : 'text-hn-text'}`}>
                                            {comment.user}
                                        </span>
                                        {comment.is_ai && (
                                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1 rounded border border-purple-500/30">BOT</span>
                                        )}
                                        <span className="text-xs text-hn-dim">{comment.time_ago}</span>
                                    </div>
                                    <p className="text-sm text-hn-text/90 leading-relaxed">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-hn-dim py-10">
                        <p>No signal in the thread.</p>
                    </div>
                )}
             </>
          )}

        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-hn-border text-center bg-hn-bg/50">
            <p className="text-[10px] text-hn-dim font-mono">
                Gemini 2.5 Flash • {new Date().getFullYear() + 10} Quantum Model
            </p>
        </div>
      </div>
    </div>
  );
};

export default NeuralPanel;