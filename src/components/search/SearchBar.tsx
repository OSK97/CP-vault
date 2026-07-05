import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onKeyDown, inputRef }) => {
  return (
    <div className="relative w-full select-none">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
        <Search className="w-5 h-5 transition-colors duration-200" />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type to search syntax... (e.g., vector pair, heap, lower_bound)"
        className="w-full bg-bg-secondary/60 hover:bg-bg-secondary border border-border-dark hover:border-border-focus focus:border-accent-purple focus:bg-bg-secondary text-text-primary placeholder-text-muted rounded-xl pl-11 pr-20 py-3.5 text-base focus:outline-none transition-all duration-200 focus:ring-1 focus:ring-accent-purple/30 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <kbd className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-border-dark bg-bg-tertiary text-[10px] font-mono text-text-secondary select-none shadow-sm">
          <span>Ctrl</span>
          <span className="text-[8px] text-text-muted">+</span>
          <span>K</span>
        </kbd>
      </div>
    </div>
  );
};
export default SearchBar;
