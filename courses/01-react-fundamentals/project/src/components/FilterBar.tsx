interface FilterBarProps {
  filter: 'all' | 'active' | 'completed'
  onFilterChange: (
    filter: 'all' | 'active' | 'completed'
  ) => void
}

export default function FilterBar({
  filter,
  onFilterChange,
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
    </div>
  )
}