import { AnnualData, CO2Data } from '../types/co2Data';

export function getLatestPopulation(data: AnnualData[]): number | null {
  const yearsWithPopulation = data
    .filter((item) => item.population !== undefined)
    .sort((a, b) => b.year - a.year);

  return yearsWithPopulation[0]?.population ?? null;
}

export function filterAndSortData(
  data: AnnualData[],
  yearFilter?: number,
  sortField?: string,
  sortDirection: 'asc' | 'desc' = 'desc'
): AnnualData[] {
  let filteredData = data;

  if (yearFilter) {
    filteredData = data.filter((item) => item.year === yearFilter);
  }

  if (sortField) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortField] ?? 0;
      const bValue = b[sortField] ?? 0;

      if (sortDirection === 'asc') {
        return (aValue as number) - (bValue as number);
      } else {
        return (bValue as number) - (aValue as number);
      }
    });
  }

  return filteredData;
}

export function getAvailableColumns(data: AnnualData[]): string[] {
  const columns = new Set<string>();

  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== 'year') {
        columns.add(key);
      }
    });
  });

  return Array.from(columns);
}

export const getAvailableYears = (data: CO2Data): number[] => {
  const years = new Set<number>();

  Object.values(data).forEach((countryData) => {
    countryData.data.forEach((yearData) => {
      if (yearData.year) {
        years.add(yearData.year);
      }
    });
  });

  return Array.from(years).sort((a, b) => b - a); // Сортируем по убыванию
};
