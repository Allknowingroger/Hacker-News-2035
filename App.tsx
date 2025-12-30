import React, { useEffect, useState, useCallback } from 'react';
import { fetchFutureStories } from './services/geminiService';
import { Story, ViewMode } from './types';
import StoryItem from './components/StoryItem';
import NeuralPanel from './components/NeuralPanel';
import { Icons } from './constants';

const App: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);

  const loadStories = useCallback(async () => {
    setLoading(true);
    // Keep selected story if possible, otherwise null
    const data = await fetchFutureStories();
    setStories(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStories();
    
    // Set simulated future date
    const date = new Date();
    date.setFullYear(date.getFullYear() + 10);
    setCurrentTime(date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, [loadStories]);

  return (
    <div className="min-h-screen bg-hn-bg text-hn-text font-sans selection:bg-hn-orange selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-hn-bg/80 backdrop-blur-sm border-b border-hn-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <div className="bg-hn-orange w-8 h-8 flex items-center justify-center rounded-sm shadow-[0_0_10px_rgba(255,102,0,0.5)]">
                <span className="font-bold text-white text-lg">Y</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-white tracking-tight">Hacker News</span>
                <span className="ml-2 text-xs font-mono text-hn-orange border border-hn-orange/30 px-1 rounded">2035 Edition</span>
              </div>
            </div>

            {/* Nav Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-hn-dim">
              <a href="#" className="text-white hover:text-hn-orange transition-colors">new</a>
              <a href="#" className="hover:text-hn-orange transition-colors">threads</a>
              <a href="#" className="hover:text-hn-orange transition-colors">past</a>
              <a href="#" className="hover:text-hn-orange transition-colors">ask</a>
              <a href="#" className="hover:text-hn-orange transition-colors">show</a>
              <a href="#" className="hover:text-hn-orange transition-colors">jobs</a>
              <a href="#" className="hover:text-hn-orange transition-colors">submit</a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
               <div className="hidden lg:block text-xs font-mono text-hn-dim">
                {currentTime}
               </div>
               
               {/* View Toggle */}
               <div className="hidden sm:flex bg-hn-card border border-hn-border rounded-lg p-0.5">
                  <button 
                    onClick={() => setViewMode(ViewMode.LIST)}
                    className={`p-1.5 rounded ${viewMode === ViewMode.LIST ? 'bg-hn-border text-white shadow-sm' : 'text-hn-dim hover:text-white'}`}
                    title="List View"
                  >
                    <Icons.List />
                  </button>
                  <button 
                    onClick={() => setViewMode(ViewMode.GRID)}
                    className={`p-1.5 rounded ${viewMode === ViewMode.GRID ? 'bg-hn-border text-white shadow-sm' : 'text-hn-dim hover:text-white'}`}
                    title="Grid View"
                  >
                    <Icons.Grid />
                  </button>
               </div>

               <button 
                onClick={loadStories} 
                disabled={loading}
                className={`p-2 rounded-full hover:bg-hn-border transition-colors text-hn-orange ${loading ? 'animate-spin' : ''}`}
                title="Refresh Feed"
               >
                 <Icons.Refresh />
               </button>
               {/* Search mock */}
               <div className="hidden sm:flex items-center bg-hn-card border border-hn-border rounded-full px-3 py-1.5 gap-2 w-48 focus-within:border-hn-orange transition-colors">
                  <Icons.Search />
                  <input 
                    type="text" 
                    placeholder="Search quantum web..." 
                    className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-hn-dim"
                  />
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 flex gap-6 relative">
        
        {/* Story List */}
        <div className={`flex-1 transition-all duration-300 ${selectedStory ? 'mr-0 md:mr-96' : ''}`}>
          
          {/* Header for list */}
          <div className="flex items-center justify-between px-4 sm:px-0 mb-4">
             <h1 className="text-xl font-bold text-white flex items-center gap-2">
               Top Stories 
               <span className="text-xs font-normal text-hn-dim bg-hn-border px-2 py-0.5 rounded-full">Live Feed</span>
             </h1>
          </div>

          <div className="bg-hn-bg sm:bg-transparent rounded-lg overflow-hidden min-h-[500px]">
            {loading ? (
              <div className={`
                 ${viewMode === ViewMode.GRID 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-0' 
                    : 'space-y-4 px-4 sm:px-0'
                  }
              `}>
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`animate-pulse ${viewMode === ViewMode.GRID ? 'h-64 border border-hn-border rounded-xl bg-hn-card/50' : 'flex gap-4 p-4 border-b border-hn-border/50'}`}>
                    {viewMode === ViewMode.LIST && (
                        <>
                            <div className="w-8 pt-2"><div className="h-4 bg-hn-border rounded w-4"></div></div>
                            <div className="flex-1 space-y-3">
                            <div className="h-4 bg-hn-border rounded w-3/4"></div>
                            <div className="h-3 bg-hn-border rounded w-1/2"></div>
                            </div>
                        </>
                    )}
                  </div>
                ))}
              </div>
            ) : stories.length > 0 ? (
              <div className={`
                ${viewMode === ViewMode.GRID 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-0 pb-8' 
                    : 'flex flex-col'
                }
              `}>
                {stories.map(story => (
                  <StoryItem 
                    key={story.id} 
                    story={story} 
                    onClick={setSelectedStory}
                    isSelected={selectedStory?.id === story.id}
                    viewMode={viewMode}
                  />
                ))}
                
                {viewMode === ViewMode.LIST && (
                    <div className="p-8 text-center">
                        <button onClick={loadStories} className="text-hn-dim hover:text-hn-orange text-sm font-medium transition-colors">
                            Load More Future...
                        </button>
                    </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-hn-dim">
                 <Icons.Terminal />
                 <p className="mt-4">No signal from the future.</p>
                 <button onClick={loadStories} className="mt-2 text-hn-orange underline">Retry Uplink</button>
              </div>
            )}
            
            {/* Grid Load More */}
            {!loading && stories.length > 0 && viewMode === ViewMode.GRID && (
                <div className="text-center py-8">
                     <button onClick={loadStories} className="text-hn-dim hover:text-hn-orange text-sm font-medium transition-colors">
                        Load More Future...
                    </button>
                </div>
            )}
          </div>
        </div>

        {/* Right Panel - Neural Context */}
        {selectedStory && (
          <NeuralPanel 
            story={selectedStory} 
            onClose={() => setSelectedStory(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;