import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
export const LoadingSpinner = () => {
  return _jsxs('div', {
    className: 'loading-spinner',
    children: [
      _jsx('div', { className: 'spinner' }),
      _jsx('p', { children: 'Loading CO2 data...' }),
    ],
  });
};
export const SkeletonLoader = () => {
  return _jsx('div', {
    className: 'skeleton-loader',
    children: Array.from({ length: 10 }).map((_, index) =>
      _jsxs(
        'div',
        {
          className: 'skeleton-row',
          children: [
            _jsx('div', { className: 'skeleton-cell' }),
            _jsx('div', { className: 'skeleton-cell' }),
            _jsx('div', { className: 'skeleton-cell' }),
          ],
        },
        index
      )
    ),
  });
};
