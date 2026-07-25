import type { ReactNode } from 'react';
import useTranslation from 'hooks/useTranslation';
import styles from './Table.module.css';

export interface TableColumn<T> {
  key: string;
  header: string;
  align?: 'start' | 'end' | 'center';
  render: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  emptyMessage?: string;
}

export default function Table<T>({ columns, data, getRowKey, emptyMessage }: TableProps<T>) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return <p className={styles.empty}>{emptyMessage ?? t('common.noDataToDisplay')}</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={styles[`align-${column.align ?? 'start'}`]}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td key={column.key} className={styles[`align-${column.align ?? 'start'}`]}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
