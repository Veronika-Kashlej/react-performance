import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect } from 'react';
import './ColumnSelectorModal.css';
export const ColumnSelectorModal = ({
  isOpen,
  onClose,
  availableColumns,
  selectedColumns,
  onColumnToggle,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  if (!isOpen) return null;
  return _jsx('div', {
    className: 'modal-overlay',
    onClick: handleBackgroundClick,
    onKeyDown: handleKeyDown,
    tabIndex: -1,
    children: _jsxs('div', {
      className: 'modal-content',
      children: [
        _jsxs('div', {
          className: 'modal-header',
          children: [
            _jsx('h2', { children: 'Select Additional Columns' }),
            _jsx('button', {
              className: 'modal-close',
              onClick: onClose,
              'aria-label': 'Close modal',
              children: '\u00D7',
            }),
          ],
        }),
        _jsx('div', {
          className: 'columns-list',
          children: availableColumns.map((column) =>
            _jsxs(
              'label',
              {
                className: 'column-checkbox',
                children: [
                  _jsx('input', {
                    type: 'checkbox',
                    checked: selectedColumns.includes(column),
                    onChange: () => onColumnToggle(column),
                  }),
                  _jsx('span', { children: column.replace(/_/g, ' ') }),
                ],
              },
              column
            )
          ),
        }),
        _jsx('div', {
          className: 'modal-footer',
          children: _jsx('button', {
            className: 'modal-apply',
            onClick: onClose,
            children: 'Apply',
          }),
        }),
      ],
    }),
  });
};
