import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Redux reducer and middleware are configured in the store.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()