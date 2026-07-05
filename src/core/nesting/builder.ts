import type { NestedTypeNode } from '../generator/types';

export interface TypeDef {
  label: string;
  paramCount: number;
  isPrimitive: boolean;
}

export const TypeDefinitions: Record<string, TypeDef> = {
  // Primitives
  'int': { label: 'int', paramCount: 0, isPrimitive: true },
  'long long': { label: 'long long', paramCount: 0, isPrimitive: true },
  'double': { label: 'double', paramCount: 0, isPrimitive: true },
  'char': { label: 'char', paramCount: 0, isPrimitive: true },
  'string': { label: 'string', paramCount: 0, isPrimitive: true },
  'bool': { label: 'bool', paramCount: 0, isPrimitive: true },
  'float': { label: 'float', paramCount: 0, isPrimitive: true },

  // STL Containers / Nested structures
  'vector': { label: 'vector<T>', paramCount: 1, isPrimitive: false },
  'pair': { label: 'pair<T1, T2>', paramCount: 2, isPrimitive: false },
  'map': { label: 'map<K, V>', paramCount: 2, isPrimitive: false },
  'set': { label: 'set<T>', paramCount: 1, isPrimitive: false },
  'unordered_map': { label: 'unordered_map<K, V>', paramCount: 2, isPrimitive: false },
  'unordered_set': { label: 'unordered_set<T>', paramCount: 1, isPrimitive: false },
  'priority_queue': { label: 'priority_queue<T>', paramCount: 1, isPrimitive: false },
  'queue': { label: 'queue<T>', paramCount: 1, isPrimitive: false },
  'stack': { label: 'stack<T>', paramCount: 1, isPrimitive: false },
  'deque': { label: 'deque<T>', paramCount: 1, isPrimitive: false },
  'list': { label: 'list<T>', paramCount: 1, isPrimitive: false }
};

let idCounter = 0;
export function generateUniqueId(): string {
  return `node-${idCounter++}-${Math.random().toString(36).substring(2, 9)}`;
}

export function createDefaultNode(name: string): NestedTypeNode {
  const def = TypeDefinitions[name];
  const node: NestedTypeNode = {
    id: generateUniqueId(),
    type: !def || def.isPrimitive ? 'primitive' : 'container',
    name,
    children: []
  };

  if (def && def.paramCount > 0) {
    for (let i = 0; i < def.paramCount; i++) {
      node.children.push(createDefaultNode('int'));
    }
  }

  return node;
}

export function compileNestedType(node: NestedTypeNode): string {
  if (node.type === 'primitive') {
    return node.name;
  }

  const def = TypeDefinitions[node.name];
  if (!def) {
    return node.name;
  }

  const compiledChildren = node.children.map(compileNestedType).join(', ');
  return `${node.name}<${compiledChildren}>`;
}
