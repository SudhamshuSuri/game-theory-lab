export const RESOURCE_ICONS = {
  gold: '\u{1FA99}', food: '\u{1F96C}', population: '\u{1F465}',
  military: '\u{1F6E1}', influence: '\u{1F3DB}', knowledge: '\u{1F4D6}',
  reputation: '\u{2B50}', trust: '\u{1F91D}',
};

export const RESOURCE_LABELS = {
  gold: 'Gold', food: 'Food', population: 'Population',
  military: 'Military', influence: 'Influence', knowledge: 'Knowledge',
  reputation: 'Reputation', trust: 'Trust',
};

export const RESOURCE_DESCRIPTIONS = {
  gold: 'The lifeblood of trade and expansion.',
  food: 'Essential for population survival and growth.',
  population: 'Your people. Source of labor and soldiers.',
  military: 'Armed forces for defense and conquest.',
  influence: 'Soft power in diplomatic circles.',
  knowledge: 'Research, intelligence, and technology.',
  reputation: 'Global standing affecting all interactions.',
};

export function formatResourceDelta(key, delta) {
  const label = RESOURCE_LABELS[key] || key;
  const icon = RESOURCE_ICONS[key] || '';
  const prefix = delta > 0 ? '+' : '';
  return `${icon} ${label}: ${prefix}${delta}`;
}

export function getResourceHealth(resources) {
  const health = {};
  for (const [key, value] of Object.entries(resources)) {
    if (key === 'gold') health.gold = value >= 50 ? 'good' : value >= 20 ? 'warning' : 'critical';
    if (key === 'food') health.food = value >= 200 ? 'good' : value >= 100 ? 'warning' : 'critical';
    if (key === 'population') health.population = value >= 200 ? 'good' : value >= 100 ? 'warning' : 'critical';
    if (key === 'military') health.military = value >= 30 ? 'good' : value >= 10 ? 'warning' : 'critical';
  }
  return health;
}
