import React, { useState, useRef, useEffect } from 'react';
import type { NestedTypeNode } from '../../core/generator/types';
import { TypeDefinitions, createDefaultNode, compileNestedType } from '../../core/nesting/builder';

const PRIMITIVE_TYPES = [
  'int',
  'long long',
  'double',
  'char',
  'string',
  'bool',
  'float'
];

const CONTAINER_TYPES = [
  'vector',
  'pair',
  'map',
  'set',
  'unordered_map',
  'unordered_set',
  'priority_queue',
  'queue',
  'stack',
  'deque',
  'list'
];

interface NestedTypeBuilderProps {
  node: NestedTypeNode;
  onChange: (node: NestedTypeNode) => void;
}

export const NestedTypeBuilder: React.FC<NestedTypeBuilderProps> = ({ node, onChange }) => {
  if (!node) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-lg select-none">
      {/* Dynamic Type Preview Header */}
      <div className="flex items-center justify-between bg-bg-primary px-3.5 py-2.5 rounded-lg border border-border-dark/60">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Compiled Type
        </span>
        <code className="font-mono text-sm font-semibold text-accent-cyan-light break-all select-all">
          {compileNestedType(node)}
        </code>
      </div>

      {/* Visual Indented Builder Panel */}
      <div className="flex flex-col bg-bg-tertiary/20 border border-border-dark rounded-lg p-3">
        <RecursiveNode node={node} onChange={onChange} />
      </div>
    </div>
  );
};

const RecursiveNode: React.FC<{
  node: NestedTypeNode;
  onChange: (node: NestedTypeNode) => void;
}> = ({ node, onChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleChildChange = (index: number, updatedChild: NestedTypeNode) => {
    const updatedChildren = [...node.children];
    updatedChildren[index] = updatedChild;
    onChange({
      ...node,
      children: updatedChildren
    });
  };

  const isPrimitive = node.type === 'primitive';

  if (isPrimitive) {
    return (
      <div className="inline-flex items-center py-0.5">
        <TokenSelector node={node} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Container header row */}
      <div className="flex items-center gap-1.5 py-0.5 h-6">
        <TokenSelector node={node} onChange={onChange} />
        <span className="text-text-muted font-mono select-none">{"<"}</span>
        
        {isCollapsed ? (
          <>
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="px-2 py-0.5 bg-bg-tertiary hover:bg-bg-tertiary/80 border border-border-dark rounded text-xs font-bold text-accent-purple-light font-mono cursor-pointer transition-all duration-100"
              title="Expand parameters"
            >
              ...
            </button>
            <span className="text-text-muted font-mono select-none">{">"}</span>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="w-5 h-5 inline-flex items-center justify-center rounded hover:bg-bg-tertiary text-text-muted hover:text-text-primary text-xs cursor-pointer transition-all duration-100 font-mono"
            title="Collapse parameters"
          >
            ▼
          </button>
        )}
      </div>

      {/* Indented children list */}
      {!isCollapsed && node.children.length > 0 && (
        <div className="flex flex-col border-l border-border-dark/60 pl-3.5 ml-2.5 my-0.5 gap-1.5">
          {node.children.map((child, idx) => {
            let childLabel = '';
            if (node.name === 'pair') {
              childLabel = idx === 0 ? 'first:' : 'second:';
            } else if (node.name === 'map' || node.name === 'unordered_map') {
              childLabel = idx === 0 ? 'key:' : 'value:';
            }

            return (
              <div key={child.id} className="flex flex-col gap-0.5 items-start">
                {childLabel && (
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider pl-0.5">
                    {childLabel}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <RecursiveNode
                    node={child}
                    onChange={(updated) => handleChildChange(idx, updated)}
                  />
                  {idx < node.children.length - 1 && (
                    <span className="text-text-muted font-mono select-none font-bold">,</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Closing Angle Bracket */}
      {!isCollapsed && (
        <div className="text-text-muted font-mono h-5 flex items-center pl-0.5 select-none">
          {">"}
        </div>
      )}
    </div>
  );
};

const TokenSelector: React.FC<{
  node: NestedTypeNode;
  onChange: (node: NestedTypeNode) => void;
}> = ({ node, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSelect = (typeName: string) => {
    setIsOpen(false);
    if (typeName === node.name) return;

    const def = TypeDefinitions[typeName];
    const isPrimitive = !def || def.isPrimitive;
    const paramCount = def ? def.paramCount : 0;

    const updated: NestedTypeNode = {
      ...node,
      type: isPrimitive ? 'primitive' : 'container',
      name: typeName,
      children: []
    };

    if (paramCount > 0) {
      for (let i = 0; i < paramCount; i++) {
        // Try to keep previous children if they fit
        if (node.children[i]) {
          updated.children.push(node.children[i]);
        } else {
          updated.children.push(createDefaultNode('int'));
        }
      }
    }

    onChange(updated);
  };

  const isPrimitive = node.type === 'primitive';

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`font-mono text-sm font-bold px-2.5 py-1 rounded select-none cursor-pointer transition-all duration-100 border focus-ring
          ${isPrimitive
            ? 'bg-cyan-950/20 hover:bg-cyan-950/40 border-cyan-800/40 hover:border-cyan-500/60 text-cyan-400'
            : 'bg-purple-950/20 hover:bg-purple-950/40 border-purple-800/40 hover:border-accent-purple text-purple-400'
          }`}
      >
        {node.name}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 z-50 w-64 bg-bg-tertiary border border-border-dark rounded-lg shadow-xl p-2.5 flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="grid grid-cols-2 gap-2">
            {/* Primitives list */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 mb-1 select-none">
                Primitives
              </span>
              {PRIMITIVE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelect(type)}
                  className={`w-full text-left px-1.5 py-0.5 rounded text-xs font-mono transition-colors duration-100 cursor-pointer
                    ${node.name === type
                      ? 'bg-cyan-950/40 text-cyan-400 font-semibold border border-cyan-800/40'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Containers list */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider pl-1 mb-1 select-none">
                Containers
              </span>
              {CONTAINER_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelect(type)}
                  className={`w-full text-left px-1.5 py-0.5 rounded text-xs font-mono transition-colors duration-100 cursor-pointer
                    ${node.name === type
                      ? 'bg-purple-950/40 text-purple-400 font-semibold border border-purple-800/40'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NestedTypeBuilder;
