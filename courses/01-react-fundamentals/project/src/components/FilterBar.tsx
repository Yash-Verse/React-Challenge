
interface FilterBarProps {
  filter: 'all' | 'active' | 'completed'
  onFilterChange: (
    filter: 'all' | 'active' | 'completed'
  ) => void

  sort:
    | 'recent'
    | 'high'
    | 'low'
    | 'alpha'
    | 'due'

  onSortChange: (
    sort:
      | 'recent'
      | 'high'
      | 'low'
      | 'alpha'
      | 'due'
  ) => void

  search: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void

  searching: boolean

  category: string
  categories: string[]
  onCategoryChange: (category: string) => void
}

export default function FilterBar({
  filter = 'all',
  onFilterChange,
  sort = 'recent',
  onSortChange,
  search = '',
  onSearchChange,
  onClearSearch,
  searching,
  category = 'All',
  categories = [],
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <div>
        <button
          type="button"
          data-active={
            filter === 'all'
              ? 'true'
              : 'false'
          }
          onClick={() =>
            onFilterChange('all')
          }
        >
          All
        </button>

        <button
          type="button"
          data-active={
            filter === 'active'
              ? 'true'
              : 'false'
          }
          onClick={() =>
            onFilterChange('active')
          }
        >
          Active
        </button>

        <button
          type="button"
          data-active={
            filter === 'completed'
              ? 'true'
              : 'false'
          }
          onClick={() =>
            onFilterChange('completed')
          }
        >
          Completed
        </button>
      </div>

      <div>
        <label htmlFor="sort-order">
          Sort
        </label>

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
                | 'due'
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

          <option value="due">
            Due Date (Soonest First)
          </option>
        </select>
      </div>

      <div>
        <label htmlFor="category-filter">
          Category
        </label>

        <select
          id="category-filter"
          value={category}
          onChange={(e) =>
            onCategoryChange(
              e.target.value
            )
          }
        >
          <option value="All">
            All categories
          </option>

          {categories.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>
      </div>

      <div>
        <label htmlFor="search-input">
          Search
        </label>

        <input
          id="search-input"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            onSearchChange(
              e.target.value
            )
          }
        />

        {search.trim() !== '' && (
          <button
            id="clear-search"
            type="button"
            onClick={onClearSearch}
          >
            Clear search
          </button>
        )}

        {searching && (
          <span id="searching-indicator">
            Searching...
          </span>
        )}
      </div>
    </div>
  )
}

