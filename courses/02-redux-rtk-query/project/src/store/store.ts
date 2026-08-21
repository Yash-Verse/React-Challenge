import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import uiReducer from './slices/uiSlice'
import filtersReducer from './slices/filtersSlice'
import { apiSlice } from '../api/apiSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ui: uiReducer,
    filters: filtersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch