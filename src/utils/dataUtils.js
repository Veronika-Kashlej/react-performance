export function getLatestPopulation(data) {
  const yearsWithPopulation = data
    .filter((item) => item.population !== undefined)
    .sort((a, b) => b.year - a.year);
  return yearsWithPopulation[0]?.population ?? null;
}
export function filterAndSortData(
  data,
  yearFilter,
  sortField,
  sortDirection = 'desc'
) {
  let filteredData = data;
  if (yearFilter) {
    filteredData = data.filter((item) => item.year === yearFilter);
  }
  if (sortField) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortField] ?? 0;
      const bValue = b[sortField] ?? 0;
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }
  return filteredData;
}
export function getAvailableColumns(data) {
  const columns = new Set();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== 'year') {
        columns.add(key);
      }
    });
  });
  return Array.from(columns);
}
export const getAvailableYears = (data) => {
  const years = new Set();
  Object.values(data).forEach((countryData) => {
    countryData.data.forEach((yearData) => {
      if (yearData.year) {
        years.add(yearData.year);
      }
    });
  });
  return Array.from(years).sort((a, b) => b - a); // Сортируем по убыванию
};
