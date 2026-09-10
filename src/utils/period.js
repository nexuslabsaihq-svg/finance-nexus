export const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const PERIOD_YEAR = 2025;

export function getPeriodPrefix(period) {
  const monthIndex = MONTH_NAMES.indexOf(period);
  if (monthIndex < 0) {
    return null;
  }

  return `${PERIOD_YEAR}-${String(monthIndex + 1).padStart(2, '0')}`;
}

export function getPreviousPeriodPrefixes(period, count = 6) {
  const monthIndex = MONTH_NAMES.indexOf(period);
  if (monthIndex < 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(PERIOD_YEAR, monthIndex - (count - index - 1), 1);
    return {
      label: MONTH_NAMES[date.getMonth()].slice(0, 3),
      prefix: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
    };
  });
}

export function getLocalDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
