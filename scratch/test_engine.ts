import { evaluateCondition, generateSyntax } from '../src/core/generator/engine';
import { createDefaultNode, compileNestedType } from '../src/core/nesting/builder';
import variableSchema from '../src/data/generators/1_syntax/variable.json';

// Mock values
const values = {
  dataType: createDefaultNode('int'),
  varName: 'x',
  hasValue: false,
  initValue: '0'
};

// Map types for compilation
const getCompiledValues = (schema: any, vals: any) => {
  const compiled: any = {};
  schema.inputs.forEach((input: any) => {
    const val = vals[input.id];
    if (input.type === 'nested_type' && val) {
      compiled[input.id] = compileNestedType(val);
    } else {
      compiled[input.id] = val;
    }
  });
  return compiled;
};

console.log("Values:", JSON.stringify(values, null, 2));
const compiledVals = getCompiledValues(variableSchema, values);
console.log("Compiled Values:", compiledVals);

const match1 = evaluateCondition("hasValue === false", values);
console.log("Condition 'hasValue === false':", match1);

const match2 = evaluateCondition("hasValue === true", values);
console.log("Condition 'hasValue === true':", match2);

const code = generateSyntax(variableSchema as any, compiledVals);
console.log("Generated Syntax:", code);
