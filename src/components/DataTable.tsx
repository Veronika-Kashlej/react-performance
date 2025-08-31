import './DataTable.css';
import { AnnualData } from '@/types/co2Data';

interface DataTableProps {
  data: AnnualData[];
  additionalColumns?: string[];
  selectedYear: number | null;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  additionalColumns = [],
  selectedYear,
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

  return (
    <div className="data-table-container">
      <button className="scroll-to-year-button" onClick={scrollToYear}>
        Scroll to {selectedYear}
      </button>
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
              <tr
                key={index}
                className={row.year === selectedYear ? 'selected-year-row' : ''}
              >
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
