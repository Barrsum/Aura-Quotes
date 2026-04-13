import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Sparkles, Copy, Check, Twitter, RefreshCw, Github, Linkedin } from 'lucide-react';

const GITHUB_URL = "https://github.com/Barrsum/Aura-Quotes";
const LINKEDIN_URL = "https://www.linkedin.com/in/ram-bapat-barrsum-diamos";

interface QuoteData {
  id: number;
  quote: string;
  author: string;
}

export default function App() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [currentQuote, setCurrentQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch quotes on mount
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // Fetching from dummyjson which has 1454 quotes. Limit=0 gets all.
        // We will filter for good length quotes to ensure premium aesthetic.
        const response = await fetch('https://dummyjson.com/quotes?limit=0');
        const data = await response.json();
        
        if (data && data.quotes) {
          // Filter for quotes that aren't too long (better for design)
          const filteredQuotes = data.quotes.filter((q: QuoteData) => q.quote.length < 120 && q.quote.length > 20);
          setQuotes(filteredQuotes);
          
          // Pick initial random quote
          const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
          setCurrentQuote(filteredQuotes[randomIndex]);
        }
      } catch (error) {
        console.error("Failed to fetch quotes:", error);
        // Fallback quote if API fails
        setCurrentQuote({
          id: 0,
          quote: "The only way to do great work is to love what you do.",
          author: "Steve Jobs"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const getNewQuote = useCallback(() => {
    if (quotes.length === 0 || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Wait for fade out
    setTimeout(() => {
      let randomIndex;
      let newQuote;
      // Ensure we don't get the exact same quote twice in a row
      do {
        randomIndex = Math.floor(Math.random() * quotes.length);
        newQuote = quotes[randomIndex];
      } while (currentQuote && newQuote.id === currentQuote.id && quotes.length > 1);
      
      setCurrentQuote(newQuote);
      setIsCopied(false);
      setIsTransitioning(false);
    }, 600); // Matches exit animation duration
  }, [quotes, currentQuote, isTransitioning]);

  const handleCopy = () => {
    if (currentQuote) {
      navigator.clipboard.writeText(`"${currentQuote.quote}" — ${currentQuote.author}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (currentQuote) {
      const text = `"${currentQuote.quote}" — ${currentQuote.author}`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-white/20 selection:text-white">
      {/* Premium Background Elements */}
      <div className="bg-mesh"></div>
      <div className="bg-noise"></div>

      {/* Header */}
      <header className="w-full p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Sparkles className="text-white/60" size={24} />
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-xl sm:text-2xl font-display tracking-[0.2em] text-white uppercase">Aura Quotes - Made By Ram Bapat</h1>
            <span className="text-[10px] font-body tracking-widest text-white/40 uppercase">Daily Inspiration</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Github size={20} /></a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Linkedin size={20} /></a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 sm:p-12 z-10 w-full max-w-5xl mx-auto my-8">
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 text-white/30"
          >
            <RefreshCw className="animate-spin" size={24} />
            <span className="text-xs tracking-widest uppercase font-body">Curating Wisdom...</span>
          </motion.div>
        ) : (
          <div className="w-full relative flex flex-col items-center">
            <Quote className="text-white/10 mb-8 sm:mb-12 w-12 h-12 sm:w-16 sm:h-16" />
            
            <div className="min-h-[200px] flex flex-col items-center justify-center w-full">
              <AnimatePresence mode="wait">
                {!isTransitioning && currentQuote && (
                  <motion.div
                    key={currentQuote.id}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    className="text-center w-full"
                  >
                    <h2 className="quote-text text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white/90 leading-tight sm:leading-tight md:leading-tight text-glow max-w-4xl mx-auto">
                      "{currentQuote.quote}"
                    </h2>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="mt-8 sm:mt-12 flex items-center justify-center gap-4"
                    >
                      <div className="h-[1px] w-8 bg-white/20"></div>
                      <p className="font-body text-xs sm:text-sm text-white/50 tracking-[0.2em] uppercase">
                        {currentQuote.author}
                      </p>
                      <div className="h-[1px] w-8 bg-white/20"></div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-16 sm:mt-24 flex flex-col sm:flex-row items-center gap-6"
            >
              <button
                onClick={getNewQuote}
                disabled={isTransitioning}
                className="group relative px-8 py-4 premium-glass rounded-full overflow-hidden transition-all duration-500 hover:bg-white/10 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <span className="relative font-body text-xs sm:text-sm tracking-[0.2em] text-white/80 uppercase flex items-center gap-2">
                  <RefreshCw size={14} className={isTransitioning ? "animate-spin" : ""} />
                  Inspire Me
                </span>
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleCopy}
                  className="p-4 rounded-full premium-glass text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
                  title="Copy Quote"
                >
                  {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
                <button
                  onClick={handleShare}
                  className="p-4 rounded-full premium-glass text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300"
                  title="Share on Twitter"
                >
                  <Twitter size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full p-6 sm:p-8 z-10 mt-auto border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-sm font-display font-bold text-white/80 mb-2 tracking-widest uppercase">Open Source</h3>
            <p className="text-white/40 text-xs max-w-sm font-body leading-relaxed">
              Built with React, Framer Motion, and Tailwind CSS. Part of the April Vibe Coding Challenge.
            </p>
          </div>
          
          <div className="flex gap-6">
            <a 
              href={GITHUB_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
            >
              <Github size={16} /> GitHub
            </a>
            <a 
              href={LINKEDIN_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-[10px] font-body tracking-widest text-white/30 uppercase">
          © 2026 Aura Quotes • Made by Ram Bapat
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
