import type { GeneratorSchema } from '../generator/types';

export interface SearchResult {
  generator: GeneratorSchema;
  score: number;
}

// Map common short-hands to standard terms
export const ALIAS_MAP: Record<string, string[]> = {
  'pq': ['priority_queue', 'heap'],
  'heap': ['priority_queue'],
  'vec': ['vector'],
  'map': ['ordered map'],
  'hash map': ['unordered_map'],
  'umap': ['unordered_map'],
  'uset': ['unordered_set'],
  'bs': ['binary_search'],
  'lb': ['lower_bound'],
  'ub': ['upper_bound'],
  'adj_list': ['vector', 'vector vector'],
  'min heap': ['priority_queue'],
  'max heap': ['priority_queue']
};

/**
 * Computes a matching score between a search query and a generator schema.
 * Higher score means better match. A score of 0 means no match.
 */
export function scoreSearch(generator: GeneratorSchema, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const title = generator.title.toLowerCase();
  const category = generator.category.toLowerCase();
  const aliases = generator.aliases.map(a => a.toLowerCase());

  // 1. Exact alias match (highest priority)
  if (aliases.includes(q)) {
    return 1000 - q.length; // shorter queries matching exact alias rank higher
  }

  // Check mapped aliases
  for (const [shortCut, fullTerms] of Object.entries(ALIAS_MAP)) {
    if (q === shortCut) {
      // Check if generator matches any of the mapped terms
      const matchesTerm = fullTerms.some(term => 
        title.includes(term) || aliases.includes(term)
      );
      if (matchesTerm) {
        return 950;
      }
    }
  }

  // 2. Exact title match
  if (title === q) {
    return 900;
  }

  // 3. Title starts with query
  if (title.startsWith(q)) {
    return 800;
  }

  // 4. Title contains query
  if (title.includes(q)) {
    return 600;
  }

  // 5. Multi-token match (e.g. "vector pair" -> tokens "vector", "pair")
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    let allTokensMatch = true;
    let tokenScore = 0;

    for (const token of tokens) {
      const matchesTitle = title.includes(token);
      const matchesAlias = aliases.some(a => a.includes(token));
      const matchesCategory = category.includes(token);

      if (matchesTitle || matchesAlias || matchesCategory) {
        if (matchesTitle) tokenScore += 100;
        if (matchesAlias) tokenScore += 50;
        if (matchesCategory) tokenScore += 20;
      } else {
        allTokensMatch = false;
        break;
      }
    }

    if (allTokensMatch) {
      return 500 + tokenScore;
    }
  }

  // 6. Substring in aliases
  const aliasMatch = aliases.find(a => a.includes(q));
  if (aliasMatch) {
    return aliasMatch.startsWith(q) ? 400 : 300;
  }

  // 7. Category match
  if (category.includes(q)) {
    return 100;
  }

  // 8. Typo-tolerant character containment check (simple Jaccard similarity)
  // For queries longer than 3 characters, see if we share a significant percentage of character bi-grams
  if (q.length > 3) {
    const generatorTokens = [title, ...aliases].join(' ');
    const sharedCharsCount = [...new Set(q)].filter(char => generatorTokens.includes(char)).length;
    const ratio = sharedCharsCount / new Set(q).size;
    if (ratio > 0.85) {
      return 50; // Weak score, but visible at the bottom
    }
  }

  return 0;
}

/**
 * Searches and ranks a list of generators based on the query.
 */
export function searchGenerators(generators: GeneratorSchema[], query: string): GeneratorSchema[] {
  if (!query.trim()) {
    return generators; // Return all (grouped or default order)
  }

  const results: SearchResult[] = generators
    .map(generator => ({
      generator,
      score: scoreSearch(generator, query)
    }))
    .filter(res => res.score > 0);

  // Sort by score descending, then by title alphabetically
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.generator.title.localeCompare(b.generator.title);
  });

  return results.map(res => res.generator);
}
