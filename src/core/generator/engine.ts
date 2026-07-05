import type { GeneratorSchema } from './types';

/**
 * Evaluates a simple conditional expression against active input values.
 * Supports:
 * - "field === 'value'" or "field !== 'value'"
 * - "field === true" or "field === false"
 * - "field" (boolean truthiness check)
 */
export function evaluateCondition(conditionStr: string, values: Record<string, any>): boolean {
  if (!conditionStr) return true;

  // Pattern for: field === 'value' or field !== 'value'
  const match = conditionStr.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*(===|!==|==|!=)\s*['"]?([^'"]*)['"]?\s*$/);
  if (match) {
    const [, field, op, rval] = match;
    const lval = values[field];

    let rightVal: any = rval;
    if (typeof lval === 'boolean') {
      rightVal = rval === 'true';
    } else if (typeof lval === 'number') {
      rightVal = Number(rval);
    }

    if (op === '===' || op === '==') {
      return lval === rightVal;
    } else {
      return lval !== rightVal;
    }
  }

  // Pattern for single field check: field
  const varMatch = conditionStr.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*$/);
  if (varMatch) {
    const [, field] = varMatch;
    return !!values[field];
  }

  return false;
}

/**
 * Validates current input values against schema rules (e.g., regex checks for valid C++ identifiers).
 */
export function validateInputs(schema: GeneratorSchema, values: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const input of schema.inputs) {
    // If input condition is not met, skip validation (it is hidden/inactive)
    if (input.condition && !evaluateCondition(input.condition, values)) {
      continue;
    }

    const value = values[input.id];

    // Mandatory string check
    if (input.type === 'string' && (value === undefined || value === null || String(value).trim() === '')) {
      errors[input.id] = `${input.label} is required`;
      continue;
    }

    // Regexp check
    if (input.validation && typeof value === 'string') {
      try {
        const regex = new RegExp(input.validation.pattern);
        if (!regex.test(value)) {
          errors[input.id] = input.validation.message || 'Invalid format';
        }
      } catch (e) {
        console.error(`Invalid regex pattern for input ${input.id}:`, e);
      }
    }
  }

  return errors;
}

/**
 * Generates compiled C++ syntax by injecting input values into the selected template.
 */
export function generateSyntax(schema: GeneratorSchema, values: Record<string, any>): string {
  let templateText = schema.template || '';

  // Evaluate conditional templates if any
  if (schema.templates && schema.templates.length > 0) {
    for (const condTemplate of schema.templates) {
      if (evaluateCondition(condTemplate.condition, values)) {
        templateText = condTemplate.value;
        break;
      }
    }
  }

  if (!templateText) {
    return '';
  }

  // Replace placeholders: {{variableName}}
  return templateText.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, fieldId) => {
    const value = values[fieldId];
    if (value === undefined || value === null) {
      return '';
    }
    return String(value);
  });
}
