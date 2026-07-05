import React from 'react';
import type { GeneratorSchema } from '../../core/generator/types';
import { Terminal, ChevronRight } from 'lucide-react';

interface SearchResultsProps {
  visibleGenerators: GeneratorSchema[];
  selectedIndex: number;
  query: string;
  onSelect: (gen: GeneratorSchema) => void;
  onHoverIndex: (idx: number) => void;
}

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return <span>{text}</span>;

  // Split query into terms and escape them for regex
  const parts = query.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return <span>{text}</span>;

  const escapedParts = parts.map(p => p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`(${escapedParts.join('|')})`, 'gi');
  const splitText = text.split(regex);

  return (
    <span>
      {splitText.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-accent-purple/30 text-accent-purple-light rounded-sm px-0.5 font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

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
        <Terminal className="w-8 h-8 text-text-muted mb-3" />
        <span className="text-sm font-semibold text-text-secondary">
          No matching syntax generators found
        </span>
        <span className="text-xs text-text-muted mt-1">
          Try typing something else or check your spelling.
        </span>
      </div>
    );
  }

  // If there's no query, group by category
  if (!query.trim()) {
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
      <div className="flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-200px)] pr-1 select-none">
        {Object.entries(categories).map(([categoryName, data]) => (
          <div key={categoryName} className="flex flex-col gap-2">
            <span className="text-xs font-bold text-accent-purple-light/80 uppercase tracking-widest pl-1 select-none">
              {categoryName}
            </span>
            <div className="flex flex-col gap-1.5">
              {data.generators.map((gen, idx) => {
                const currentGlobalIdx = data.startIndex + idx;
                const isSelected = currentGlobalIdx === selectedIndex;

                return (
                  <GeneratorCard
                    key={gen.id}
                    gen={gen}
                    isSelected={isSelected}
                    query={query}
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
    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[calc(100vh-200px)] pr-1 select-none">
      <div className="flex flex-col gap-1.5">
        {visibleGenerators.map((gen, idx) => {
          const isSelected = idx === selectedIndex;

          return (
            <GeneratorCard
              key={gen.id}
              gen={gen}
              isSelected={isSelected}
              query={query}
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
  query: string;
  onClick: () => void;
  onMouseEnter: () => void;
}

const GeneratorCard: React.FC<GeneratorCardProps> = ({ gen, isSelected, query, onClick, onMouseEnter }) => {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`group relative flex items-center justify-between py-2 px-3.5 rounded-lg border transition-all duration-150 cursor-pointer select-none
        ${isSelected
          ? 'bg-bg-tertiary border-accent-purple shadow-[0_0_12px_rgba(139,92,246,0.06)]'
          : 'bg-bg-secondary/20 border-border-dark hover:border-border-focus hover:bg-bg-secondary/40'
        }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <Terminal className={`w-4.5 h-4.5 shrink-0 transition-colors duration-150
          ${isSelected ? 'text-accent-purple-light' : 'text-text-secondary group-hover:text-text-primary'}`}
        />
        <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
          <span className="text-sm font-semibold text-text-primary truncate">
            {highlightText(gen.title, query)}
          </span>
          <div className="hidden sm:flex items-center gap-1">
            {gen.aliases.slice(0, 2).map(alias => (
              <span key={alias} className="text-xs font-mono text-text-muted px-1.5 py-0.2 bg-bg-primary/50 rounded border border-border-dark/30">
                {highlightText(alias, query)}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-text-muted/80 uppercase bg-bg-tertiary/40 border border-border-dark/50 px-1.5 py-0.5 rounded">
          {gen.category}
        </span>
        <ChevronRight className={`w-3.5 h-3.5 text-text-muted transition-all duration-150
          ${isSelected ? 'translate-x-0.5 text-accent-purple-light' : 'group-hover:translate-x-0.5 group-hover:text-text-secondary'}`}
        />
      </div>
    </div>
  );
};

export default SearchResults;
