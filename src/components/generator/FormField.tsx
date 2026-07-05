import React from 'react';
import type { FormFieldSchema, NestedTypeNode } from '../../core/generator/types';
import { NestedTypeBuilder } from './NestedTypeBuilder';

interface FormFieldProps {
  input: FormFieldSchema;
  value: any;
  error?: string;
  onChange: (val: any) => void;
}

export const FormField: React.FC<FormFieldProps> = ({ input, value, error, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between select-none">
        <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          {input.label}
        </label>
        {error && (
          <span className="text-xs text-red-400 font-medium">
            {error}
          </span>
        )}
      </div>

      {input.type === 'string' && (
        <input
          type="text"
          value={value ?? ''}
          placeholder={input.placeholder || `Enter ${input.label.toLowerCase()}`}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full max-w-lg rounded-md border bg-bg-secondary px-3 py-2 text-sm font-mono text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus-ring
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
              : 'border-border-dark focus:border-accent-purple focus:ring-accent-purple/30'
            }`}
        />
      )}

      {input.type === 'select' && (
        input.options && input.options.length <= 5 ? (
          <div className="flex flex-wrap gap-1 bg-bg-tertiary p-0.5 rounded-md border border-border-dark max-w-fit select-none">
            {input.options.map((opt) => {
              const isSelected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange(opt)}
                  className={`px-3 py-1.5 rounded text-sm font-semibold select-none cursor-pointer transition-all duration-100 focus-ring
                    ${isSelected
                      ? 'bg-accent-purple text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40'
                    }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <select
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full max-w-[240px] rounded-md border border-border-dark bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 focus:outline-none cursor-pointer focus-ring"
          >
            {input.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )
      )}

      {input.type === 'boolean' && (
        <div className="flex gap-1 bg-bg-tertiary p-0.5 rounded-md border border-border-dark max-w-fit select-none">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={`px-3.5 py-1.5 rounded text-sm font-semibold select-none cursor-pointer transition-all duration-100 focus-ring
              ${value
                ? 'bg-accent-purple text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40'
              }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => onChange(false)}
            className={`px-3.5 py-1.5 rounded text-sm font-semibold select-none cursor-pointer transition-all duration-100 focus-ring
              ${!value
                ? 'bg-accent-purple text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary/40'
              }`}
          >
            No
          </button>
        </div>
      )}

      {input.type === 'nested_type' && (
        <NestedTypeBuilder
          node={value as NestedTypeNode}
          onChange={onChange}
        />
      )}
    </div>
  );
};
export default FormField;
