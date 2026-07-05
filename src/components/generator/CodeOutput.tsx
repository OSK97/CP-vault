import React, { useState, useEffect, useCallback } from 'react';
import { Clipboard, Check, RotateCcw } from 'lucide-react';

interface CodeOutputProps {
  code: string;
  onReset: () => void;
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ code, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, [code]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Global Ctrl+C handler for when the user wants to copy
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If code output is empty, ignore
      if (!code) return;
      
      // Ctrl+C (or Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        // If nothing is selected by the browser, copy our generated syntax code
        const selection = window.getSelection();
        if (!selection || selection.toString() === '') {
          e.preventDefault();
          handleCopy();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, handleCopy]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Generated Syntax
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-border-dark hover:border-border-focus transition cursor-pointer"
            title="Reset to default values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className={`relative flex flex-col rounded-lg bg-[#0e1017] border border-border-dark overflow-hidden transition-all duration-300 ${copied ? 'border-accent-cyan ring-1 ring-accent-cyan/30' : ''}`}>
        {/* Code Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-dark/80 bg-bg-secondary/40 select-none">
          <span className="text-xs font-mono font-bold text-accent-purple-light">
            C++
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted font-mono bg-bg-primary px-1.5 py-0.5 rounded border border-border-dark">
              Ctrl + C
            </span>
          </div>
        </div>

        {/* Code Block */}
        <div className="p-4 overflow-x-auto min-h-[70px]">
          <pre className="font-mono text-base text-text-primary whitespace-pre-wrap break-all select-all leading-relaxed">
            {code || '// Configure fields to generate syntax'}
          </pre>
        </div>

        {/* Big Copy Button */}
        <button
          onClick={handleCopy}
          disabled={!code}
          className={`flex items-center justify-center gap-2 w-full py-3 border-t text-sm font-semibold transition cursor-pointer select-none
            ${!code 
              ? 'bg-bg-secondary/20 text-text-muted border-border-dark cursor-not-allowed' 
              : copied
                ? 'bg-accent-cyan/10 hover:bg-accent-cyan/15 text-accent-cyan-light border-accent-cyan/40 animate-pulse-cyan'
                : 'bg-accent-purple/10 hover:bg-accent-purple/20 text-accent-purple-light border-border-dark hover:border-accent-purple/50'
            }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Clipboard className="w-4 h-4" />
              Copy Syntax
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default CodeOutput;
