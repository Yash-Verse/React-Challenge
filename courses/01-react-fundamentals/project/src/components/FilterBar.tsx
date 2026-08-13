import {
  useEffect,
  useRef,
  type RefObject,
} from 'react'

import Button from './Button'
import FormInput from './FormInput'

export type FilterType =
  | 'all'
  | 'active'
  | 'completed'

export type SortType =
  | 'recent'
  | 'high-low'
  | 'low-high'
  | 'alphabetical'
  | 'due-date'

interface FilterBarProps {
  filter: FilterType
  onFilterChange: (
    filter: FilterType
  ) => void

  sortOrder: SortType
  onSortChange: (
    sort: SortType
  ) => void

  search: string
  onSearchChange: (
    search: string
  ) => void

  onClearSearch: () => void

  searchInputRef?: RefObject<HTMLInputElement>

  categories?: string[]
  category?: string
  onCategoryChange?: (
    category: string
  ) => void
}

export default function FilterBar({
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
  search,
  onSearchChange,
  onClearSearch,
  categories = [],
  category = 'all',
  onCategoryChange,
}: FilterBarProps) {
  // Challenge 23:
  // Create a ref for the search input.
  const searchInputRef =
    useRef<HTMLInputElement>(null)

  // Focus the search input when FilterBar mounts.
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  return (
    <div >
      <button
        data-active={filter === 'all'}
        onClick={() =>
          onFilterChange('all')
        }
      >
        All
      </button>

      <button
        data-active={filter === 'active'}
        onClick={() =>
          onFilterChange('active')
        }
      >
        Active
      </button>

      <button
        data-active={filter === 'completed'}
        onClick={() =>
          onFilterChange('completed')
        }
      >
        Completed
      </button>

      <select
        id="category-filter"
        value={category}
        onChange={(e) =>
          onCategoryChange?.(
            e.target.value
          )
        }
      >
        <option value="all">
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

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) =>
          onSortChange(
            e.target.value as SortType
          )
        }
      >
        <option value="recent">
          Recently Added
        </option>

        <option value="high-low">
          Priority: High to Low
        </option>

        <option value="low-high">
          Priority: Low to High
        </option>

        <option value="alphabetical">
          Alphabetical
        </option>

        <option value="due-date">
          Due Date (Soonest First)
        </option>
      </select>

      <FormInput
  label=""
  id="search-input"
  type="text"
  ref={searchInputRef}
  value={search}
  onChange={(e) =>
    onSearchChange(e.target.value)
  }
  placeholder="Search tasks"
/>

      {search && (
        <Button
          id="clear-search"
          variant="secondary"
          onClick={onClearSearch}
        >
          Clear search
        </Button>
      )}
    </div>
  )
}