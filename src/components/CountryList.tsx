import React, {
  Suspense,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { CO2Data } from '../types/co2Data';
import { getAvailableYears, getLatestPopulation } from '../utils/dataUtils';
import { DataTable } from './DataTable';
import { SkeletonLoader } from './LoadingSpinner';
import { ColumnSelectorModal } from './ColumnSelectorModal';
import './CountryList.css';

interface CountryListProps {
  data: CO2Data;
}

type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'population-asc'
  | 'population-desc';

export const CountryList: React.FC<CountryListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [highlightUpdate, setHighlightUpdate] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  useEffect(() => {
    const years = getAvailableYears(data);
    setAvailableYears(years);
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(Math.max(...years));
    }
  }, [data, selectedYear]);

  const availableRegions = useMemo(() => {
    const regions = new Set<string>();
    Object.keys(data).forEach((country) => {
      const region = country.charAt(0).toUpperCase();
      regions.add(region);
    });
    return ['all', ...Array.from(regions).sort()];
  }, [data]);

  const availableColumns = useMemo(() => {
    const columns = new Set<string>();
    Object.values(data).forEach((countryData) => {
      countryData.data.forEach((yearData) => {
        Object.keys(yearData).forEach((key) => {
          if (
            key !== 'year' &&
            key !== 'population' &&
            key !== 'co2' &&
            key !== 'co2_per_capita'
          ) {
            columns.add(key);
          }
        });
      });
    });
    return Array.from(columns).sort();
  }, [data]);

  const filteredCountries = useMemo(() => {
    return Object.entries(data).filter(([country]) => {
      const matchesSearch = country
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const countryRegion = country.charAt(0).toUpperCase();
      const matchesRegion =
        selectedRegion === 'all' || countryRegion === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [data, searchTerm, selectedRegion]);

  const sortedCountries = useMemo(() => {
    return [...filteredCountries].sort(
      ([countryA, countryDataA], [countryB, countryDataB]) => {
        switch (sortBy) {
          case 'name-asc':
            return countryA.localeCompare(countryB);

          case 'name-desc':
            return countryB.localeCompare(countryA);

          case 'population-asc': {
            const populationA = selectedYear
              ? countryDataA.data.find((d) => d.year === selectedYear)
                  ?.population
              : getLatestPopulation(countryDataA.data);
            const populationB = selectedYear
              ? countryDataB.data.find((d) => d.year === selectedYear)
                  ?.population
              : getLatestPopulation(countryDataB.data);

            if (populationA === undefined && populationB === undefined)
              return 0;
            if (populationA === undefined || populationA === null) return 1;
            if (populationB === undefined || populationB === null) return -1;

            return populationA - populationB;
          }

          case 'population-desc': {
            const populationA = selectedYear
              ? countryDataA.data.find((d) => d.year === selectedYear)
                  ?.population
              : getLatestPopulation(countryDataA.data);
            const populationB = selectedYear
              ? countryDataB.data.find((d) => d.year === selectedYear)
                  ?.population
              : getLatestPopulation(countryDataB.data);

            if (populationA === undefined && populationB === undefined)
              return 0;
            if (populationA === undefined || populationA === null) return 1;
            if (populationB === undefined || populationB === null) return -1;

            return populationB - populationA;
          }

          default:
            return countryA.localeCompare(countryB);
        }
      }
    );
  }, [filteredCountries, sortBy, selectedYear]);

  const memoizedSelectedColumns = useMemo(
    () => selectedColumns,
    [selectedColumns]
  );

  const handleColumnToggle = useCallback((column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    setHighlightUpdate(true);
    setTimeout(() => {
      setHighlightUpdate(false);
    }, 2000);
  }, []);

  const handleRegionChange = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  const handleSortChange = useCallback((option: SortOption) => {
    setSortBy(option);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleModalToggle = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCountrySelect = useCallback((country: string) => {
    setSelectedCountry((prev) => (prev === country ? null : country));
  }, []);

  return (
    <div className="country-list-container">
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <div className="year-selector-container">
            <label htmlFor="year-select" className="year-select-label">
              Select Year:
            </label>
            <select
              id="year-select"
              value={selectedYear || ''}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="year-select"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="region-selector-container">
            <label htmlFor="region-select" className="region-select-label">
              Filter by Region:
            </label>
            <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="region-select"
            >
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region === 'all' ? 'All Regions' : `Region ${region}`}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-selector-container">
            <label htmlFor="sort-select" className="sort-select-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="population-asc">Population (Low to High)</option>
              <option value="population-desc">Population (High to Low)</option>
            </select>
          </div>
        </div>

        <button className="column-selector-button" onClick={handleModalToggle}>
          Select Columns
        </button>
      </div>

      <ColumnSelectorModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        availableColumns={availableColumns}
        selectedColumns={memoizedSelectedColumns}
        onColumnToggle={handleColumnToggle}
      />

      <div className="countries-info">
        <p>Showing {sortedCountries.length} countries</p>
        {selectedRegion !== 'all' && (
          <span className="region-filter-indicator">
            Filtered by: Region {selectedRegion}
          </span>
        )}
        <span className="sort-indicator">
          Sorted by: {sortBy.includes('name') ? 'Name' : 'Population'} (
          {sortBy.includes('asc') ? 'Ascending' : 'Descending'})
        </span>
      </div>

      <div className="countries-grid">
        {sortedCountries.map(([country, countryData]) => {
          const latestPopulation = getLatestPopulation(countryData.data);
          const selectedYearData = selectedYear
            ? countryData.data.find((d) => d.year === selectedYear)
            : null;
          const displayPopulation =
            selectedYearData?.population ?? latestPopulation;

          const countryRegion = country.charAt(0).toUpperCase();

          return (
            <div
              key={country}
              className={`country-card ${highlightUpdate ? 'highlight' : ''}`}
            >
              <div
                className="country-header"
                onClick={() => handleCountrySelect(country)}
              >
                <h3>{country}</h3>
                <div className="country-info">
                  <span className="iso-code">
                    ISO: {countryData.iso_code || 'N/A'}
                  </span>
                  <span className="region">Region: {countryRegion}</span>
                  <span
                    className={`population ${selectedYear ? 'year-highlight' : ''}`}
                  >
                    Population: {displayPopulation?.toLocaleString() || 'N/A'}
                    {selectedYear && ` (${selectedYear})`}
                  </span>
                </div>
              </div>

              {selectedCountry === country && (
                <Suspense fallback={<SkeletonLoader />}>
                  <DataTable
                    data={countryData.data}
                    additionalColumns={memoizedSelectedColumns}
                    selectedYear={selectedYear}
                  />
                </Suspense>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
