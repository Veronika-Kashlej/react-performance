import React, { Suspense, useState } from 'react';
import { CO2Data } from '../types/co2Data';
import { getLatestPopulation } from '../utils/dataUtils';
import { DataTable } from './DataTable';
import { SkeletonLoader } from './LoadingSpinner';
import './CountryList.css';
interface CountryListProps {
  data: CO2Data;
}

export const CountryList: React.FC<CountryListProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const filteredCountries = Object.entries(data).filter(([country]) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCountries = filteredCountries.sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div className="country-list-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

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
                  <DataTable data={countryData.data} countryName={country} />
                </Suspense>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
