import { Oficio, Zone, Urgency, TradeCategory } from '@/types';

// Trade Categories
export const TRADE_CATEGORIES: { value: TradeCategory; label: string }[] = [
  { value: 'construccion', label: 'Construcción' },
  { value: 'tecnicos', label: 'Técnicos' },
  { value: 'hogar', label: 'Hogar' },
  { value: 'automotor', label: 'Automotor' },
  { value: 'servicios-varios', label: 'Servicios varios' },
];

// Subtrades by Category
export const SUBTRADES_BY_CATEGORY: Record<TradeCategory, { value: Oficio; label: string }[]> = {
  construccion: [
    { value: 'albanil', label: 'Albañil' },
    { value: 'pintor', label: 'Pintor' },
    { value: 'techista', label: 'Techista' },
    { value: 'gasista', label: 'Gasista' },
    { value: 'plomero', label: 'Plomero' },
    { value: 'electricista', label: 'Electricista' },
  ],
  tecnicos: [
    { value: 'tecnico-celulares', label: 'Técnico en celulares' },
    { value: 'tecnico-pc', label: 'Técnico en PC' },
    { value: 'tecnico-notebooks', label: 'Técnico en notebooks' },
    { value: 'tecnico-tv', label: 'Técnico en TV / Smart TV' },
    { value: 'tecnico-electrodomesticos', label: 'Técnico en electrodomésticos' },
    { value: 'tecnico-aire-acondicionado', label: 'Técnico en aire acondicionado' },
    { value: 'tecnico-heladeras', label: 'Técnico en heladeras' },
    { value: 'tecnico-lavarropas', label: 'Técnico en lavarropas' },
  ],
  hogar: [
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'jardineria', label: 'Jardinería' },
    { value: 'fletes', label: 'Fletes' },
    { value: 'mudanzas', label: 'Mudanzas' },
    { value: 'armado-muebles', label: 'Armado de muebles' },
  ],
  automotor: [
    { value: 'mecanico', label: 'Mecánico' },
    { value: 'electricista-automotor', label: 'Electricista automotor' },
    { value: 'gomero', label: 'Gomero' },
    { value: 'cerrajero-automotor', label: 'Cerrajero automotor' },
  ],
  'servicios-varios': [
    { value: 'cerrajero', label: 'Cerrajero' },
    { value: 'herrero', label: 'Herrero' },
    { value: 'carpintero', label: 'Carpintero' },
    { value: 'soldador', label: 'Soldador' },
  ],
};

// All trades flattened for backward compatibility
export const OFICIOS: { value: Oficio; label: string }[] = [
  ...SUBTRADES_BY_CATEGORY.construccion,
  ...SUBTRADES_BY_CATEGORY.tecnicos,
  ...SUBTRADES_BY_CATEGORY.hogar,
  ...SUBTRADES_BY_CATEGORY.automotor,
  ...SUBTRADES_BY_CATEGORY['servicios-varios'],
];

// Map old trade values to new ones for migration
export const LEGACY_TRADE_MAPPING: Record<string, Oficio> = {
  'albañil': 'albanil',
  'electricista': 'electricista',
  'plomero': 'plomero',
};

export const ZONES: { value: Zone; label: string }[] = [
  { value: 'CABA', label: 'CABA' },
  { value: 'GBA Sur', label: 'GBA Sur' },
  { value: 'GBA Norte', label: 'GBA Norte' },
  { value: 'GBA Oeste', label: 'GBA Oeste' },
  { value: 'La Plata', label: 'La Plata' },
  { value: 'Córdoba', label: 'Córdoba' },
  { value: 'Rosario', label: 'Rosario' },
];

export const URGENCIES: { value: Urgency; label: string; color: string }[] = [
  { value: 'normal', label: 'Normal', color: 'bg-gray-100 text-gray-800' },
  { value: 'hoy', label: 'Hoy', color: 'bg-blue-100 text-blue-800' },
  { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800' },
];

export const getOficioLabel = (oficio: Oficio): string => {
  return OFICIOS.find(o => o.value === oficio)?.label || oficio;
};

export const getCategoryLabel = (category: TradeCategory): string => {
  return TRADE_CATEGORIES.find(c => c.value === category)?.label || category;
};

export const getCategoryForTrade = (oficio: Oficio): TradeCategory | null => {
  for (const [category, trades] of Object.entries(SUBTRADES_BY_CATEGORY)) {
    if (trades.some(t => t.value === oficio)) {
      return category as TradeCategory;
    }
  }
  return null;
};

export const getSubtradesForCategory = (category: TradeCategory): { value: Oficio; label: string }[] => {
  return SUBTRADES_BY_CATEGORY[category] || [];
};

export const getZoneLabel = (zone: Zone): string => {
  return ZONES.find(z => z.value === zone)?.label || zone;
};

export const getUrgencyConfig = (urgency: Urgency) => {
  return URGENCIES.find(u => u.value === urgency) || URGENCIES[0];
};
