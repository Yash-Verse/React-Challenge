import Button from './Button'
import FormInput from './FormInput'

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
    <div>
      {/* Status filters */}
      <div>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            onFilterChange('all')
          }
        >
          All
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            onFilterChange('active')
          }
        >
          Active
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            onFilterChange('completed')
          }
        >
          Completed
        </Button>
      </div>

      {/* Sort */}
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

      {/* Category */}
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

          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div>
        <FormInput
          id="search-input"
          label="Search"
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
          <Button
            id="clear-search"
            type="button"
            variant="secondary"
            onClick={onClearSearch}
          >
            Clear search
          </Button>
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