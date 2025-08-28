import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Suspense } from 'react';
import { CountryList } from './components/CountryList';
import { LoadingSpinner } from './components/LoadingSpinner';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
const CO2DataResource = (() => {
  let promise = null;
  let result = null;
  let error = null;
  return {
    read() {
      if (result) return result;
      if (error) throw error;
      if (!promise) {
        promise = new Promise(async (resolve, reject) => {
          try {
            const response = await fetch('/data.json');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            result = data;
            resolve(data);
          } catch (err) {
            error = err;
            reject(err);
          }
        });
      }
      throw promise;
    },
  };
})();
const SuspenseCountryList = () => {
  const data = CO2DataResource.read();
  return _jsx(CountryList, { data: data });
};
export const App = () => {
  return _jsxs('div', {
    className: 'app',
    children: [
      _jsx('header', {
        className: 'app-header',
        children: _jsx('h1', { children: 'CO2 Emissions Data by Country' }),
      }),
      _jsx('main', {
        className: 'app-main',
        children: _jsx(ErrorBoundary, {
          fallback: _jsxs('div', {
            className: 'error-container',
            children: [
              _jsx('h2', { children: 'Error Loading Data' }),
              _jsx('p', { children: 'Failed to load data' }),
            ],
          }),
          children: _jsx(Suspense, {
            fallback: _jsx(LoadingSpinner, {}),
            children: _jsx(SuspenseCountryList, {}),
          }),
        }),
      }),
    ],
  });
};
