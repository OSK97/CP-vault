import React, { useState, useEffect, useCallback } from 'react';
import type { GeneratorSchema } from '../../core/generator/types';
import { FormField } from './FormField';
import { CodeOutput } from './CodeOutput';
import { evaluateCondition, generateSyntax, validateInputs } from '../../core/generator/engine';
import { createDefaultNode, compileNestedType } from '../../core/nesting/builder';
import { Sparkles, X } from 'lucide-react';

interface GeneratorLayoutProps {
  generator: GeneratorSchema;
  onClose: () => void;
}

const getInitialValues = (generator: GeneratorSchema): Record<string, any> => {
  const initial: Record<string, any> = {};
  generator.inputs.forEach((input) => {
    if (input.type === 'nested_type') {
      initial[input.id] = createDefaultNode(input.default || 'int');
    } else if (input.type === 'boolean') {
      initial[input.id] = input.default === 'true' || (input.default as any) === true;
    } else {
      initial[input.id] = input.default ?? '';
    }
  });
  return initial;
};

export const GeneratorLayout: React.FC<GeneratorLayoutProps> = ({ generator, onClose }) => {
  const [values, setValues] = useState<Record<string, any>>(() => getInitialValues(generator));
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize values when the generator changes or is reset
  const initValues = useCallback(() => {
    setValues(getInitialValues(generator));
    setErrors({});
  }, [generator]);

  useEffect(() => {
    initValues();
  }, [generator.id, initValues]);


  // Handle a single field value change
  const handleChange = (fieldId: string, val: any) => {
    const updatedValues = { ...values, [fieldId]: val };
    setValues(updatedValues);

    // Validate inputs live
    const validationErrors = validateInputs(generator, updatedValues);
    setErrors(validationErrors);
  };

  // Compile values to format needed for the template (e.g. nested_type -> C++ string)
  const getCompiledValues = () => {
    const compiled: Record<string, any> = {};
    generator.inputs.forEach((input) => {
      const val = values[input.id];
      if (input.type === 'nested_type' && val) {
        compiled[input.id] = compileNestedType(val);
      } else {
        compiled[input.id] = val;
      }
    });
    return compiled;
  };

  // Generate code only if there are no validation errors
  const isFormValid = Object.keys(errors).length === 0;
  const compiledCode = isFormValid ? generateSyntax(generator, getCompiledValues()) : '';

  console.log(`[SyntaxForge Debug] Generator: ${generator.title}`, {
    values,
    errors,
    isFormValid,
    compiledCode
  });

  return (
    <div className="flex flex-col gap-4.5 w-full bg-bg-secondary/90 border border-border-dark rounded-xl p-5 shadow-2xl lg:max-h-[calc(100vh-120px)]">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-border-dark/60 pb-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/20 text-accent-purple-light">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary leading-tight">
              {generator.title}
            </h2>
            <p className="text-[10px] text-text-secondary mt-0.5">
              {generator.category}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-bg-tertiary border border-transparent hover:border-border-dark text-text-secondary hover:text-text-primary transition cursor-pointer focus-ring"
          title="Close panel (Esc)"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Code output display (Live Preview) - Prominent, at the top */}
      <div className="shrink-0">
        <CodeOutput
          code={compiledCode}
          onReset={initValues}
        />
      </div>

      {/* Inputs Form - Scrollable underneath the preview */}
      <div className="flex-1 flex flex-col gap-4.5 overflow-y-auto pr-1 pb-2">
        {generator.inputs.map((input) => {
          // Check if field condition is met
          if (input.condition && !evaluateCondition(input.condition, values)) {
            return null;
          }

          return (
            <FormField
              key={input.id}
              input={input}
              value={values[input.id]}
              error={errors[input.id]}
              onChange={(val) => handleChange(input.id, val)}
            />
          );
        })}
      </div>
    </div>
  );
};
export default GeneratorLayout;
