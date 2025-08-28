import React, { useMemo, useCallback, memo } from 'react';
import styled from 'styled-components';

// Memoized styled components for better performance
const MemoizedContainer = memo(styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`);

const MemoizedButton = memo(styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`);

// Memoized list item component
interface ListItemProps {
  id: string;
  title: string;
  description: string;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const ListItem = memo<ListItemProps>(({ id, title, description, onSelect, isSelected }) => {
  const handleClick = useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);

  const itemStyle = useMemo(() => ({
    backgroundColor: isSelected ? '#e3f2fd' : 'white',
    border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0'
  }), [isSelected]);

  return (
    <div 
      style={itemStyle}
      onClick={handleClick}
      className="list-item"
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
});

ListItem.displayName = 'ListItem';

// Memoized search component
interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SearchInput = memo<SearchProps>(({ onSearch, placeholder = 'Ara...', debounceMs = 300 }) => {
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Trigger search when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery !== '') {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px'
      }}
    />
  );
});

SearchInput.displayName = 'SearchInput';

// Memoized data table component
interface DataTableProps<T> {
  data: T[];
  columns: Array<{
    key: keyof T;
    header: string;
    render?: (value: any, item: T) => React.ReactNode;
  }>;
  onRowClick?: (item: T) => void;
  sortable?: boolean;
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
}

function DataTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick, 
  sortable = false,
  onSort 
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection]);

  const handleSort = useCallback((key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    
    if (onSort) {
      onSort(key, sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc');
    }
  }, [sortKey, sortDirection, onSort]);

  const handleRowClick = useCallback((item: T) => {
    if (onRowClick) {
      onRowClick(item);
    }
  }, [onRowClick]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            {columns.map(column => (
              <th
                key={String(column.key)}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  cursor: sortable ? 'pointer' : 'default',
                  userSelect: 'none'
                }}
                onClick={() => sortable && handleSort(column.key)}
              >
                {column.header}
                {sortable && sortKey === column.key && (
                  <span style={{ marginLeft: '8px' }}>
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(item => (
            <tr
              key={item.id}
              onClick={() => handleRowClick(item)}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }
              }}
              onMouseLeave={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              {columns.map(column => (
                <td
                  key={String(column.key)}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6'
                  }}
                >
                  {column.render 
                    ? column.render(item[column.key], item)
                    : String(item[column.key] || '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Memoize the entire table component
const MemoizedDataTable = memo(DataTable) as typeof DataTable;

// Virtual scrolling component for large lists
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function VirtualList<T>({ items, itemHeight, containerHeight, renderItem }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const totalHeight = items.length * itemHeight;
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length);
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  const offsetY = startIndex * itemHeight;
  
  return (
    <div
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MemoizedVirtualList = memo(VirtualList) as typeof VirtualList;

export {
  MemoizedContainer,
  MemoizedButton,
  ListItem,
  SearchInput,
  MemoizedDataTable,
  MemoizedVirtualList
};
