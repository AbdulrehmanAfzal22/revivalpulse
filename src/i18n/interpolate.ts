export function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, token: string) =>
    token in params ? String(params[token]) : match
  );
}
