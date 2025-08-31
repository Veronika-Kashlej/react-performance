import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading CO2 data...</p>
    </div>
  );
};

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="skeleton-loader">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="skeleton-row">
          <div className="skeleton-cell"></div>
          <div className="skeleton-cell"></div>
          <div className="skeleton-cell"></div>
        </div>
      ))}
    </div>
  );
};
