import React from 'react';
import type { GeneratorSchema } from '../../core/generator/types';
import { Layers, Terminal, ChevronRight } from 'lucide-react';

interface SearchResultsProps {
  visibleGenerators: GeneratorSchema[];
  selectedIndex: number;
  query: string;
  onSelect: (gen: GeneratorSchema) => void;
  onHoverIndex: (idx: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  visibleGenerators,
  selectedIndex,
  query,
  onSelect,
  onHoverIndex
}) => {
  if (visibleGenerators.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-dark rounded-xl bg-bg-secondary/10 select-none">
        <Layers className="w-10 h-10 text-text-muted mb-3" />
        <span className="text-sm font-semibold text-text-secondary">
          No matching syntax generators found
        </span>
        <span className="text-xs text-text-muted mt-1">
          Try typing something else or check your spelling.
        </span>
      </div>
    );
  }

  // If there's no query, we group by category to make a beautiful directory layout
  if (!query.trim()) {
    // Get ordered categories in insertion order
    const categories: Record<string, { generators: GeneratorSchema[]; startIndex: number }> = {};
    let globalIdx = 0;

    visibleGenerators.forEach((gen) => {
      if (!categories[gen.category]) {
        categories[gen.category] = { generators: [], startIndex: globalIdx };
      }
      categories[gen.category].generators.push(gen);
      globalIdx++;
    });

    return (
      <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
        {Object.entries(categories).map(([categoryName, data]) => (
          <div key={categoryName} className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-accent-purple-light uppercase tracking-widest pl-1 select-none">
              {categoryName}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.generators.map((gen, idx) => {
                const currentGlobalIdx = data.startIndex + idx;
                const isSelected = currentGlobalIdx === selectedIndex;

                return (
                  <GeneratorCard
                    key={gen.id}
                    gen={gen}
                    isSelected={isSelected}
                    onClick={() => onSelect(gen)}
                    onMouseEnter={() => onHoverIndex(currentGlobalIdx)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If there's a search query, render a flat ranked list
  return (
    <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visibleGenerators.map((gen, idx) => {
          const isSelected = idx === selectedIndex;

          return (
            <GeneratorCard
              key={gen.id}
              gen={gen}
              isSelected={isSelected}
              onClick={() => onSelect(gen)}
              onMouseEnter={() => onHoverIndex(idx)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface GeneratorCardProps {
  gen: GeneratorSchema;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

const GeneratorCard: React.FC<GeneratorCardProps> = ({ gen, isSelected, onClick, onMouseEnter }) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`group relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none
        ${isSelected 
          ? 'bg-bg-tertiary/80 border-accent-purple shadow-[0_0_15px_rgba(139,92,246,0.08)]' 
          : 'bg-bg-secondary/40 border-border-dark hover:border-border-focus hover:bg-bg-secondary/60'
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors duration-200
          ${isSelected 
            ? 'bg-accent-purple/20 border-accent-purple/30 text-accent-purple-light' 
            : 'bg-bg-tertiary border-border-dark text-text-secondary group-hover:text-text-primary group-hover:border-border-focus'
          }`}
        >
          <Terminal className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary leading-snug">
            {gen.title}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {gen.aliases.slice(0, 3).map(alias => (
              <span key={alias} className="text-[10px] font-mono text-text-muted px-1.5 py-0.2 bg-bg-primary/60 rounded border border-border-dark/40">
                {alias}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ChevronRight className={`w-4 h-4 text-text-muted transition-all duration-200
        ${isSelected ? 'translate-x-0.5 text-accent-purple-light' : 'group-hover:translate-x-0.5 group-hover:text-text-secondary'}`} 
      />
    </div>
  );
};
export default SearchResults;
