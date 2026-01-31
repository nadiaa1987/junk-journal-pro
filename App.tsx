
import React, { useState } from 'react';
import { ThemeKey, JunkJournalImage, GenerationProgress } from './types';
import { THEME_PRESETS } from './constants';
import { generatePollinationsImage, downloadBlob } from './services/imageService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeKey>(ThemeKey.BOTANICAL);
  const [customPrompt, setCustomPrompt] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [gallery, setGallery] = useState<JunkJournalImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    const total = quantity;
    const basePrompt = theme === ThemeKey.CUSTOM ? customPrompt : THEME_PRESETS[theme].prompt;
    
    for (let i = 1; i <= total; i++) {
      try {
        setProgress({ current: i, total, status: `Generating page ${i} of ${total}...` });
        
        const seed = Math.floor(Math.random() * 2147483647);
        const { url, blob } = await generatePollinationsImage(basePrompt, seed);
        
        // Automatic download
        downloadBlob(blob, `junk-journal-${seed}.png`);

        const newImg: JunkJournalImage = {
          id: `${seed}-${i}`,
          url: url,
          prompt: basePrompt,
          theme: THEME_PRESETS[theme].name,
          timestamp: Date.now(),
          blob: blob
        };
        
        setGallery(prev => [newImg, ...prev]);
        
      } catch (err: any) {
        console.error("Generation error:", err);
        setError(err.message || "An unexpected error occurred.");
        break; // Stop bulk generation on error
      }
    }

    setIsGenerating(false);
    setProgress(null);
  };

  return (
    <div className="min-h-screen paper-texture flex flex-col">
      {/* Header */}
      <header className="py-10 px-6 border-b border-stone-200/50 bg-white/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black vintage-font text-stone-800 mb-2 tracking-tight">
            Junk Journal <span className="text-stone-400 italic">One-Click</span>
          </h1>
          <p className="text-stone-500 font-medium uppercase tracking-widest text-xs">
            Authenticated Flux Generation • Automatic Bulk Download
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Controls Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-stone-200/60 sticky top-6">
            <h2 className="text-xl font-bold vintage-font mb-4 text-stone-700">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Theme</label>
                <select 
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 font-medium"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeKey)}
                >
                  {Object.entries(THEME_PRESETS).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>

              {theme === ThemeKey.CUSTOM && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Prompt</label>
                  <textarea
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 h-24 resize-none text-sm"
                    placeholder="Describe your journal page..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Quantity</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="1" max="20" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="flex-1 accent-stone-800"
                  />
                  <span className="w-8 text-center font-bold text-stone-700">{quantity}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || (theme === ThemeKey.CUSTOM && !customPrompt.trim())}
                className="w-full py-4 bg-stone-800 text-stone-100 rounded-xl font-bold text-lg hover:bg-stone-700 transition-all disabled:opacity-50 shadow-lg"
              >
                {isGenerating ? 'Processing...' : 'Generate Now'}
              </button>
            </div>

            {progress && (
              <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-xs font-bold text-stone-600 mb-2">{progress.status}</p>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-stone-800 transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Gallery Area */}
        <section className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold vintage-font text-stone-800">Gallery</h2>
            <span className="text-stone-400 text-sm">{gallery.length} Images</span>
          </div>

          {gallery.length === 0 ? (
            <div className="h-64 border-2 border-dashed border-stone-300 rounded-3xl flex items-center justify-center text-stone-400 italic">
              No images generated yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div key={img.id} className="bg-white p-2 rounded-xl shadow-md border border-stone-200 overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg bg-stone-100">
                    <img 
                      src={img.url} 
                      alt="Journal Page" 
                      className="w-full h-full object-cover sepia-overlay"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{img.theme}</p>
                    <p className="text-xs text-stone-600 italic line-clamp-1 mt-1">{img.prompt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="py-8 text-center text-stone-400 text-[10px] uppercase tracking-widest">
        Pollinations Authenticated Flux API • Junk Journal Pro
      </footer>
    </div>
  );
};

export default App;
