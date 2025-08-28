import React, { Suspense } from 'react';
import { CountryList } from './components/CountryList';
import { LoadingSpinner } from './components/LoadingSpinner';
import './App.css';
import { CO2Data } from './types/co2Data';
import ErrorBoundary from './components/ErrorBoundary';
import co2Data from './data.json';
const CO2DataResource = (() => {
  let promise: Promise<CO2Data> | null = null;
  let result: CO2Data | null = null;
  let error: Error | null = null;
  return {
    read() {
      if (result) return result;
      if (error) throw error;
      if (!promise) {
        promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              result = co2Data as CO2Data;
              resolve(co2Data as CO2Data);
            } catch (err) {
              error = err as Error;
              reject(err);
            }
          }, 1000);
        });
      }
      throw promise;
    },
  };
})();

const SuspenseCountryList = () => {
  const data = CO2DataResource.read();
  return <CountryList data={data} />;
};

export const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>CO2 Emissions Data by Country</h1>
      </header>

      <main className="app-main">
        <ErrorBoundary
          fallback={
            <div className="error-container">
              <h2>Error Loading Data</h2>
              <p>Failed to load data</p>
            </div>
          }
        >
          <Suspense fallback={<LoadingSpinner />}>
            <SuspenseCountryList />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};
