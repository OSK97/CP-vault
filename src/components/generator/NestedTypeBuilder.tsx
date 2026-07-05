import React from 'react';
import type { NestedTypeNode } from '../../core/generator/types';
import { TypeDefinitions, createDefaultNode } from '../../core/nesting/builder';

interface NestedTypeBuilderProps {
  node: NestedTypeNode;
  onChange: (node: NestedTypeNode) => void;
}

export const NestedTypeBuilder: React.FC<NestedTypeBuilderProps> = ({ node, onChange }) => {
  if (!node) {
    return null;
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newName = e.target.value;
    const updated = createDefaultNode(newName);
    onChange(updated);
  };

  const handleChildChange = (index: number, updatedChild: NestedTypeNode) => {
    const updatedChildren = [...node.children];
    updatedChildren[index] = updatedChild;
    onChange({
      ...node,
      children: updatedChildren
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-bg-secondary p-3 border border-border-dark w-full max-w-lg">
      <div className="flex items-center gap-2">
        <select
          value={node.name}
          onChange={handleTypeChange}
          className="rounded-md border border-border-dark bg-bg-tertiary px-3 py-1.5 text-sm text-text-primary focus:border-accent-purple focus:ring-1 focus:ring-accent-purple focus:outline-none cursor-pointer w-full max-w-[200px]"
        >
          <optgroup label="Primitive Types">
            {Object.entries(TypeDefinitions)
              .filter(([_, def]) => def.isPrimitive)
              .map(([name, def]) => (
                <option key={name} value={name}>
                  {def.label}
                </option>
              ))}
          </optgroup>
          <optgroup label="STL Containers / Types">
            {Object.entries(TypeDefinitions)
              .filter(([_, def]) => !def.isPrimitive)
              .map(([name, def]) => (
                <option key={name} value={name}>
                  {def.label}
                </option>
              ))}
          </optgroup>
        </select>
      </div>

      {node.children.length > 0 && (
        <div className="flex flex-col gap-3 border-l border-border-dark pl-4 ml-3 mt-1">
          {node.children.map((child, idx) => {
            let childLabel = `Type ${idx + 1}`;
            if (node.name === 'pair') {
              childLabel = idx === 0 ? 'first (T1)' : 'second (T2)';
            } else if (node.name === 'map' || node.name === 'unordered_map') {
              childLabel = idx === 0 ? 'key (K)' : 'value (V)';
            } else if (node.name === 'vector') {
              childLabel = 'element (T)';
            } else if (node.name === 'set' || node.name === 'unordered_set' || node.name === 'priority_queue' || node.name === 'queue' || node.name === 'stack' || node.name === 'deque' || node.name === 'list') {
              childLabel = 'value (T)';
            }

            return (
              <div key={child.id} className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {childLabel}
                </span>
                <NestedTypeBuilder
                  node={child}
                  onChange={(updated) => handleChildChange(idx, updated)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default NestedTypeBuilder;
