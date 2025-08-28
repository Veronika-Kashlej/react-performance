import React from 'react';
import './DataTable.css';
import { AnnualData } from '@/types/co2Data';

interface DataTableProps {
  data: AnnualData[];
  countryName: string;
  additionalColumns?: string[];
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  countryName,
  additionalColumns = [],
}) => {
  const sortedData = [...data].sort((a, b) => b.year - a.year);

  const allColumns = [
    'year',
    'population',
    'co2',
    'co2_per_capita',
    ...additionalColumns,
  ];

  const formatValue = (value: number | undefined) => {
    if (value == null) return 'N/A';
    if (typeof value === 'number') {
      if (typeof value === 'number' && value >= 1000 && value <= 9999) {
        return value.toString();
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className="data-table-container">
      <h4>Annual Data for {countryName}</h4>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {allColumns.map((column) => (
                <th key={column}>{column.replace(/_/g, ' ').toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                {allColumns.map((column) => (
                  <td key={column}>{formatValue(row[column])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
