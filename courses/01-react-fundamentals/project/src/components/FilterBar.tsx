interface FilterBarProps {
  filter: 'all' | 'active' | 'completed'
  onFilterChange: (
    filter: 'all' | 'active' | 'completed'
  ) => void

  sort: 'recent' | 'high' | 'low' | 'alpha'
  onSortChange: (
    sort: 'recent' | 'high' | 'low' | 'alpha'
  ) => void

  search: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void

  searching: boolean
}

export default function FilterBar({
  filter = 'all',
  onFilterChange,
  sort = 'recent',
  onSortChange,
  search = '',
  onSearchChange = () => {},
  onClearSearch = () => {},
  searching= false,
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <button
        type="button"
        data-active={filter === 'all'}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>

      <button
        type="button"
        data-active={filter === 'active'}
        onClick={() => onFilterChange('active')}
      >
        Active
      </button>

      <button
        type="button"
        data-active={filter === 'completed'}
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </button>

      <select
        id="sort-order"
        value={sort}
        onChange={(e) =>
          onSortChange(
            e.target.value as
              | 'recent'
              | 'high'
              | 'low'
              | 'alpha'
          )
        }
      >
        <option value="recent">
          Recently Added
        </option>
        <option value="high">
          Priority: High to Low
        </option>
        <option value="low">
          Priority: Low to High
        </option>
        <option value="alpha">
          Alphabetical
        </option>
      </select>

      <input
        id="search-input"
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
      />

      { search && search.trim() !== '' && (
        <button
          id="clear-search"
          type="button"
          onClick={onClearSearch}
        >
          Clear search
        </button>
      )}
      {searching && (
       <div id="searching-indicator">
        Searching...
       </div>
       )}
    </div>
  )
}