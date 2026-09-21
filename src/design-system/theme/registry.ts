export interface BrandDefinition {
  readonly id: string;
  readonly label: string;
}

export function defineBrands<const T extends readonly BrandDefinition[]>(defs: T): T {
  return defs;
}

export const brands = defineBrands([
  { id: 'default', label: 'Default' },
  { id: 'violet', label: 'Violet' },
  { id: 'teal', label: 'Teal' },
] as const);

export type Brand = (typeof brands)[number]['id'];

export const defaultBrand: Brand = brands[0].id;

export function isBrand(value: unknown): value is Brand {
  return typeof value === 'string' && brands.some((b) => b.id === value);
}
