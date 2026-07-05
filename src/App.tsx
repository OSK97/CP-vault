import { useState, useEffect, useRef } from 'react';
import { generatorsList } from './data/registry';
import { searchGenerators } from './core/search/search';
import { SearchBar } from './components/search/SearchBar';
import { SearchResults } from './components/search/SearchResults';
import { GeneratorLayout } from './components/generator/GeneratorLayout';
import { ShortcutsPanel } from './components/layout/ShortcutsPanel';
import type { GeneratorSchema } from './core/generator/types';
import { Terminal, Lightbulb } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedGen, setSelectedGen] = useState<GeneratorSchema | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Compute matching generators
  const visibleGenerators = searchGenerators(generatorsList, query);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus search bar on load or when closing generator panel
  useEffect(() => {
    if (!selectedGen) {
      searchInputRef.current?.focus();
    }
  }, [selectedGen]);

  // Keyboard navigation & global shortcuts listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 1. Ctrl + K or '/' to focus search (if not already focusing an input field)
      const isInputActive = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT';
      
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') ||
        (e.key === '/' && !isInputActive)
      ) {
        e.preventDefault();
        setSelectedGen(null);
        setQuery('');
        searchInputRef.current?.focus();
        return;
      }

      // 2. Escape to close or clear
      if (e.key === 'Escape') {
        e.preventDefault();
        if (selectedGen) {
          setSelectedGen(null);
        } else {
          setQuery('');
          searchInputRef.current?.blur();
        }
        return;
      }

      // 3. ArrowUp and ArrowDown to navigate search results (only when search is active or list is visible)
      if (!selectedGen && visibleGenerators.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % visibleGenerators.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + visibleGenerators.length) % visibleGenerators.length);
        }
      }

      // 4. Enter to select/open the current highlighted generator
      if (e.key === 'Enter' && !selectedGen && visibleGenerators.length > 0) {
        // Only trigger if we are not editing another input
        if (document.activeElement === searchInputRef.current || !isInputActive) {
          e.preventDefault();
          const targetGen = visibleGenerators[selectedIndex];
          if (targetGen) {
            setSelectedGen(targetGen);
            // Blur search so they can tab through generator fields
            searchInputRef.current?.blur();
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedGen, visibleGenerators, selectedIndex]);

  const handleSelectGenerator = (gen: GeneratorSchema) => {
    setSelectedGen(gen);
  };

  const handleHoverIndex = (index: number) => {
    // Only update index if a generator is not active/open, to prevent jitter
    if (!selectedGen) {
      setSelectedIndex(index);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      {/* Header section */}
      <header className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-6 pb-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/20 text-accent-purple-light shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <Terminal className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-text-primary via-accent-purple-light to-accent-cyan-light bg-clip-text text-transparent leading-none">
              SyntaxForge
            </h1>
            <p className="text-[10px] text-text-secondary mt-1 font-medium tracking-wide">
              The fastest C++ syntax generator for competitive programming
            </p>
          </div>
        </div>
      </header>

      {/* Main dashboard body */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Search Omni-Box & List */}
        <section className={`flex flex-col gap-4 transition-all duration-300 ${selectedGen ? 'lg:col-span-5 xl:col-span-4' : 'lg:col-span-12 max-w-4xl mx-auto w-full'}`}>
          <SearchBar
            value={query}
            onChange={setQuery}
            onKeyDown={() => {}}
            inputRef={searchInputRef}
          />
          
          <SearchResults
            visibleGenerators={visibleGenerators}
            selectedIndex={selectedIndex}
            query={query}
            onSelect={handleSelectGenerator}
            onHoverIndex={handleHoverIndex}
          />
        </section>

        {/* Right Side: Active Form Generator Details */}
        {selectedGen ? (
          <section className="lg:col-span-7 xl:col-span-8 w-full h-full lg:sticky lg:top-6">
            <GeneratorLayout
              generator={selectedGen}
              onClose={() => setSelectedGen(null)}
            />
          </section>
        ) : (
          <section className="hidden lg:flex lg:col-span-12 flex-col items-center justify-center p-12 border border-dashed border-border-dark rounded-2xl bg-bg-secondary/10 max-w-4xl mx-auto w-full select-none mt-4">
            <Lightbulb className="w-8 h-8 text-accent-purple-light/40 mb-3" />
            <span className="text-sm font-semibold text-text-secondary">
              Search and select a generator to start
            </span>
            <span className="text-xs text-text-muted mt-1 max-w-xs text-center leading-relaxed">
              Use arrow keys to browse, press <kbd className="px-1 bg-bg-tertiary rounded text-[10px]">Enter</kbd> to edit, and <kbd className="px-1 bg-bg-tertiary rounded text-[10px]">Ctrl+C</kbd> to copy.
            </span>
          </section>
        )}
      </main>

      {/* Global shortcuts legend footer */}
      <footer className="fixed bottom-0 left-0 w-full z-40 border-t border-border-dark bg-bg-primary">
        <ShortcutsPanel />
      </footer>
    </div>
  );
}
