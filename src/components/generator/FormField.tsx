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
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-primary">
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
          className={`w-full max-w-lg rounded-md border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' 
              : 'border-border-dark focus:border-accent-purple focus:ring-accent-purple/30'
            }`}
        />
      )}

      {input.type === 'select' && (
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-[240px] rounded-md border border-border-dark bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/30 focus:outline-none cursor-pointer"
        >
          {input.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {input.type === 'boolean' && (
        <label className="relative inline-flex items-center cursor-pointer select-none mt-1">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-purple peer-checked:after:bg-text-primary border border-border-dark"></div>
        </label>
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
