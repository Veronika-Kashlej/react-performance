import React, { Suspense, useState } from 'react';
import { CO2Data } from '../types/co2Data';
import { getLatestPopulation } from '../utils/dataUtils';
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

          return (
            <div key={country} className="country-card">
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
                  <span>ISO: {countryData.iso_code || 'N/A'}</span>
                  <span>
                    Population: {latestPopulation?.toLocaleString() || 'N/A'}
                  </span>
                </div>
              </div>

              {selectedCountry === country && (
                <Suspense fallback={<SkeletonLoader />}>
                  <DataTable
                    data={countryData.data}
                    countryName={country}
                    additionalColumns={selectedColumns}
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
