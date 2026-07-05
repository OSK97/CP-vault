import React from 'react';

export const ShortcutsPanel: React.FC = () => {
  const items = [
    { keys: ['Ctrl', 'K'], desc: 'Focus search' },
    { keys: ['↑', '↓'], desc: 'Navigate list' },
    { keys: ['Enter'], desc: 'Open generator' },
    { keys: ['Tab'], desc: 'Next field' },
    { keys: ['Esc'], desc: 'Clear / Close' },
    { keys: ['Ctrl', 'C'], desc: 'Copy syntax' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-border-dark/60 bg-bg-primary py-3.5 px-4 text-xs select-none">
      <span className="text-text-muted font-medium uppercase tracking-wider text-[10px]">
        Keyboard Navigation:
      </span>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-text-secondary">{item.desc}</span>
            <div className="flex items-center gap-1">
              {item.keys.map((k, kIdx) => (
                <React.Fragment key={kIdx}>
                  {kIdx > 0 && <span className="text-[9px] text-text-muted">+</span>}
                  <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border-dark bg-bg-secondary text-[10px] font-mono text-text-secondary shadow-sm">
                    {k}
                  </kbd>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ShortcutsPanel;
