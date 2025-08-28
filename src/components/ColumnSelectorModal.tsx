import React, { useEffect } from 'react';
import './ColumnSelectorModal.css';

interface ColumnSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableColumns: string[];
  selectedColumns: string[];
  onColumnToggle: (column: string) => void;
}

export const ColumnSelectorModal: React.FC<ColumnSelectorModalProps> = ({
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

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>Select Additional Columns</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="columns-list">
          {availableColumns.map((column) => (
            <label key={column} className="column-checkbox">
              <input
                type="checkbox"
                checked={selectedColumns.includes(column)}
                onChange={() => onColumnToggle(column)}
              />
              <span>{column.replace(/_/g, ' ')}</span>
            </label>
          ))}
        </div>

        <div className="modal-footer">
          <button className="modal-apply" onClick={onClose}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
