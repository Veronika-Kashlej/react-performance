import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Suspense, useState, useEffect, useMemo, useCallback } from 'react';
import { getAvailableYears, getLatestPopulation } from '../utils/dataUtils';
import { DataTable } from './DataTable';
import { SkeletonLoader } from './LoadingSpinner';
import { ColumnSelectorModal } from './ColumnSelectorModal';
import './CountryList.css';
export const CountryList = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [highlightUpdate, setHighlightUpdate] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  useEffect(() => {
    const years = getAvailableYears(data);
    setAvailableYears(years);
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(Math.max(...years));
    }
  }, [data, selectedYear]);
  const availableRegions = useMemo(() => {
    const regions = new Set();
    Object.keys(data).forEach((country) => {
      const region = country.charAt(0).toUpperCase();
      regions.add(region);
    });
    return ['all', ...Array.from(regions).sort()];
  }, [data]);
  const availableColumns = useMemo(() => {
    const columns = new Set();
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
  const handleColumnToggle = useCallback((column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  }, []);
  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    setHighlightUpdate(true);
    setTimeout(() => {
      setHighlightUpdate(false);
    }, 2000);
  }, []);
  const handleRegionChange = useCallback((region) => {
    setSelectedRegion(region);
  }, []);
  const handleSortChange = useCallback((option) => {
    setSortBy(option);
  }, []);
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);
  const handleModalToggle = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const handleCountrySelect = useCallback((country) => {
    setSelectedCountry((prev) => (prev === country ? null : country));
  }, []);
  return _jsxs('div', {
    className: 'country-list-container',
    children: [
      _jsxs('div', {
        className: 'controls-container',
        children: [
          _jsx('div', {
            className: 'search-container',
            children: _jsx('input', {
              type: 'text',
              placeholder: 'Search countries...',
              value: searchTerm,
              onChange: handleSearchChange,
              className: 'search-input',
            }),
          }),
          _jsxs('div', {
            className: 'filter-container',
            children: [
              _jsxs('div', {
                className: 'year-selector-container',
                children: [
                  _jsx('label', {
                    htmlFor: 'year-select',
                    className: 'year-select-label',
                    children: 'Select Year:',
                  }),
                  _jsx('select', {
                    id: 'year-select',
                    value: selectedYear || '',
                    onChange: (e) => handleYearChange(Number(e.target.value)),
                    className: 'year-select',
                    children: availableYears.map((year) =>
                      _jsx('option', { value: year, children: year }, year)
                    ),
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'region-selector-container',
                children: [
                  _jsx('label', {
                    htmlFor: 'region-select',
                    className: 'region-select-label',
                    children: 'Filter by Region:',
                  }),
                  _jsx('select', {
                    id: 'region-select',
                    value: selectedRegion,
                    onChange: (e) => handleRegionChange(e.target.value),
                    className: 'region-select',
                    children: availableRegions.map((region) =>
                      _jsx(
                        'option',
                        {
                          value: region,
                          children:
                            region === 'all'
                              ? 'All Regions'
                              : `Region ${region}`,
                        },
                        region
                      )
                    ),
                  }),
                ],
              }),
              _jsxs('div', {
                className: 'sort-selector-container',
                children: [
                  _jsx('label', {
                    htmlFor: 'sort-select',
                    className: 'sort-select-label',
                    children: 'Sort by:',
                  }),
                  _jsxs('select', {
                    id: 'sort-select',
                    value: sortBy,
                    onChange: (e) => handleSortChange(e.target.value),
                    className: 'sort-select',
                    children: [
                      _jsx('option', {
                        value: 'name-asc',
                        children: 'Name (A-Z)',
                      }),
                      _jsx('option', {
                        value: 'name-desc',
                        children: 'Name (Z-A)',
                      }),
                      _jsx('option', {
                        value: 'population-asc',
                        children: 'Population (Low to High)',
                      }),
                      _jsx('option', {
                        value: 'population-desc',
                        children: 'Population (High to Low)',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          _jsx('button', {
            className: 'column-selector-button',
            onClick: handleModalToggle,
            children: 'Select Columns',
          }),
        ],
      }),
      _jsx(ColumnSelectorModal, {
        isOpen: isModalOpen,
        onClose: handleModalClose,
        availableColumns: availableColumns,
        selectedColumns: memoizedSelectedColumns,
        onColumnToggle: handleColumnToggle,
      }),
      _jsxs('div', {
        className: 'countries-info',
        children: [
          _jsxs('p', {
            children: ['Showing ', sortedCountries.length, ' countries'],
          }),
          selectedRegion !== 'all' &&
            _jsxs('span', {
              className: 'region-filter-indicator',
              children: ['Filtered by: Region ', selectedRegion],
            }),
          _jsxs('span', {
            className: 'sort-indicator',
            children: [
              'Sorted by: ',
              sortBy.includes('name') ? 'Name' : 'Population',
              ' (',
              sortBy.includes('asc') ? 'Ascending' : 'Descending',
              ')',
            ],
          }),
        ],
      }),
      _jsx('div', {
        className: 'countries-grid',
        children: sortedCountries.map(([country, countryData]) => {
          const latestPopulation = getLatestPopulation(countryData.data);
          const selectedYearData = selectedYear
            ? countryData.data.find((d) => d.year === selectedYear)
            : null;
          const displayPopulation =
            selectedYearData?.population ?? latestPopulation;
          const countryRegion = country.charAt(0).toUpperCase();
          return _jsxs(
            'div',
            {
              className: `country-card ${highlightUpdate ? 'highlight' : ''}`,
              children: [
                _jsxs('div', {
                  className: 'country-header',
                  onClick: () => handleCountrySelect(country),
                  children: [
                    _jsx('h3', { children: country }),
                    _jsxs('div', {
                      className: 'country-info',
                      children: [
                        _jsxs('span', {
                          className: 'iso-code',
                          children: ['ISO: ', countryData.iso_code || 'N/A'],
                        }),
                        _jsxs('span', {
                          className: 'region',
                          children: ['Region: ', countryRegion],
                        }),
                        _jsxs('span', {
                          className: `population ${selectedYear ? 'year-highlight' : ''}`,
                          children: [
                            'Population: ',
                            displayPopulation?.toLocaleString() || 'N/A',
                            selectedYear && ` (${selectedYear})`,
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                selectedCountry === country &&
                  _jsx(Suspense, {
                    fallback: _jsx(SkeletonLoader, {}),
                    children: _jsx(DataTable, {
                      data: countryData.data,
                      additionalColumns: memoizedSelectedColumns,
                      selectedYear: selectedYear,
                    }),
                  }),
              ],
            },
            country
          );
        }),
      }),
    ],
  });
};
