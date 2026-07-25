const cache = new Map<string, Intl.PluralRules>();

export function getPluralRules(code: string): Intl.PluralRules {
  let rules = cache.get(code);
  if (!rules) {
    rules = new Intl.PluralRules(code);
    cache.set(code, rules);
  }
  return rules;
}
