const { evaluateCondition, generateSyntax } = require('./src/core/generator/engine.js');
const { createDefaultNode, compileNestedType } = require('./src/core/nesting/builder.js');
const variableSchema = require('./src/data/generators/1_syntax/variable.json');

// Mock values
const values = {
  dataType: createDefaultNode('int'),
  varName: 'x',
  hasValue: false,
  initValue: '0'
};

// Map types for compilation
const getCompiledValues = (schema, vals) => {
  const compiled = {};
  schema.inputs.forEach((input) => {
    const val = vals[input.id];
    if (input.type === 'nested_type' && val) {
      compiled[input.id] = compileNestedType(val);
    } else {
      compiled[input.id] = val;
    }
  });
  return compiled;
};

console.log("Values:", values);
const compiledVals = getCompiledValues(variableSchema, values);
console.log("Compiled Values:", compiledVals);

const match1 = evaluateCondition("hasValue === false", values);
console.log("Condition 'hasValue === false':", match1);

const match2 = evaluateCondition("hasValue === true", values);
console.log("Condition 'hasValue === true':", match2);

const code = generateSyntax(variableSchema, compiledVals);
console.log("Generated Syntax:", code);
