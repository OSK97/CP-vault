import type { GeneratorSchema } from '../core/generator/types';

// Vite compile-time eager loading for all JSON templates under generators/
const modules = import.meta.glob<GeneratorSchema>('./generators/**/*.json', { eager: true });

export const generatorsList: GeneratorSchema[] = Object.values(modules).map((mod: any) => {
  return mod.default || mod;
});

// Helper to partition generators by category for list UI
export const getGeneratorsByCategory = (): Record<string, GeneratorSchema[]> => {
  const categories: Record<string, GeneratorSchema[]> = {};
  generatorsList.forEach(gen => {
    if (!categories[gen.category]) {
      categories[gen.category] = [];
    }
    categories[gen.category].push(gen);
  });
  return categories;
};
