import React, { Suspense, useState, useEffect } from 'react';
import { CO2Data } from '../types/co2Data';
import { getAvailableYears, getLatestPopulation } from '../utils/dataUtils';
import { DataTable } from './DataTable';
import { SkeletonLoader } from './LoadingSpinner';
import { ColumnSelectorModal } from './ColumnSelectorModal';
import './CountryList.css';

interface CountryListProps {
  data: CO2Data;
}

export const CountryList: React.FC<CountryListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [highlightUpdate, setHighlightUpdate] = useState(false);

  useEffect(() => {
    const years = getAvailableYears(data);
    setAvailableYears(years);
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(Math.max(...years));
    }
  }, [data, selectedYear]);

  const availableColumns = React.useMemo(() => {
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

  const filteredCountries = Object.entries(data).filter(([country]) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCountries = filteredCountries.sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setHighlightUpdate(true);

    setTimeout(() => {
      setHighlightUpdate(false);
    }, 2000);
  };

  return (
    <div className="country-list-container">
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

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

        <button
          className="column-selector-button"
          onClick={() => setIsModalOpen(true)}
        >
          Select Columns
        </button>
      </div>

      <ColumnSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableColumns={availableColumns}
        selectedColumns={selectedColumns}
        onColumnToggle={handleColumnToggle}
      />

      <div className="countries-grid">
        {sortedCountries.map(([country, countryData]) => {
          const latestPopulation = getLatestPopulation(countryData.data);
          const selectedYearData = selectedYear
            ? countryData.data.find((d) => d.year === selectedYear)
            : null;
          const displayPopulation =
            selectedYearData?.population ?? latestPopulation;

          return (
            <div
              key={country}
              className={`country-card ${highlightUpdate ? 'highlight' : ''}`}
            >
              <div
                className="country-header"
                onClick={() =>
                  setSelectedCountry(
                    selectedCountry === country ? null : country
                  )
                }
              >
                <h3>{country}</h3>
                <div className="country-info">
                  <span className="iso-code">
                    ISO: {countryData.iso_code || 'N/A'}
                  </span>
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
                    additionalColumns={selectedColumns}
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
