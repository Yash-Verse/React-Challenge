import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type SortBy = 'newest' | 'oldest' | 'title'

interface FiltersState {
  sortBy: SortBy
  filterUserId: number | null
}

const initialState: FiltersState = {
  sortBy: 'newest',
  filterUserId: null,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload
    },
    setFilterUserId: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.filterUserId = action.payload
    },
  },
})

export const { setSortBy, setFilterUserId } = filtersSlice.actions

export default filtersSlice.reducer