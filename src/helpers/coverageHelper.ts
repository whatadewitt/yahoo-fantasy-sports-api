export interface Coverage {
  type: 'season' | 'week' | 'date';
  value: string;
}

function isDateString(param: unknown): param is string {
  return typeof param === 'string' && param.indexOf('-') > 0;
}

export function parseWeek(param: unknown): number | undefined {
  if (typeof param !== 'number' && typeof param !== 'string') return undefined;
  if (typeof param === 'string' && (param === '' || param.indexOf('-') > 0)) {
    return undefined;
  }

  const week = Number(param);
  return !Number.isNaN(week) && week >= 1 ? week : undefined;
}

export function resolveCoverage(param?: unknown): Coverage {
  if (isDateString(param)) {
    return { type: 'date', value: param };
  }

  const week = parseWeek(param);
  if (week !== undefined) {
    return { type: 'week', value: String(week) };
  }

  return { type: 'season', value: '' };
}

export function coverageFilter(coverage: Coverage): string {
  return coverage.type === 'season'
    ? ''
    : `;${coverage.type}=${coverage.value}`;
}

export function typedCoverageFilter(coverage: Coverage): string {
  return coverage.type === 'season'
    ? ''
    : `;type=${coverage.type}${coverageFilter(coverage)}`;
}
