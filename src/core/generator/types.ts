export type FormFieldType = 'string' | 'select' | 'boolean' | 'nested_type';

export interface FormFieldValidation {
  pattern: string; // Regex pattern as string
  message: string; // Error message
}

export interface FormFieldSchema {
  id: string;
  label: string;
  type: FormFieldType;
  default?: string;
  placeholder?: string;
  options?: string[]; // Required for 'select' type
  validation?: FormFieldValidation;
  condition?: string; // e.g. "type === 'array'"
}

export interface ConditionalTemplate {
  condition: string; // e.g. "type === 'array'"
  value: string; // Template string to use
}

export interface GeneratorSchema {
  id: string;
  title: string;
  category: string;
  aliases: string[];
  inputs: FormFieldSchema[];
  template?: string; // Default template if no conditional templates match
  templates?: ConditionalTemplate[]; // Conditional templates
}

// AST structure for recursive nested types
export interface NestedTypeNode {
  id: string; // Unique identifier for React rendering
  type: 'primitive' | 'container';
  name: string; // e.g., 'vector', 'pair', 'int'
  children: NestedTypeNode[]; // Recursively nested type nodes
}
