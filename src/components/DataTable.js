import { jsxs as _jsxs, jsx as _jsx } from 'react/jsx-runtime';
import './DataTable.css';
export const DataTable = ({ data, additionalColumns = [], selectedYear }) => {
  const sortedData = [...data].sort((a, b) => b.year - a.year);
  const allColumns = [
    'year',
    'population',
    'co2',
    'co2_per_capita',
    ...additionalColumns,
  ];
  const formatValue = (value) => {
    if (value == null) return 'N/A';
    if (typeof value === 'number') {
      if (value >= 1000 && value <= 9999) {
        return value.toString();
      }
      return value.toLocaleString();
    }
    return value;
  };
  function scrollToYear() {
    const element = document.querySelector('.selected-year-row');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  return _jsxs('div', {
    className: 'data-table-container',
    children: [
      _jsxs('button', {
        className: 'scroll-to-year-button',
        onClick: scrollToYear,
        children: ['Scroll to ', selectedYear],
      }),
      _jsx('div', {
        className: 'table-wrapper',
        children: _jsxs('table', {
          className: 'data-table',
          children: [
            _jsx('thead', {
              children: _jsx('tr', {
                children: allColumns.map((column) =>
                  _jsx(
                    'th',
                    { children: column.replace(/_/g, ' ').toUpperCase() },
                    column
                  )
                ),
              }),
            }),
            _jsx('tbody', {
              children: sortedData.map((row, index) =>
                _jsx(
                  'tr',
                  {
                    className:
                      row.year === selectedYear ? 'selected-year-row' : '',
                    children: allColumns.map((column) =>
                      _jsx('td', { children: formatValue(row[column]) }, column)
                    ),
                  },
                  index
                )
              ),
            }),
          ],
        }),
      }),
    ],
  });
};
