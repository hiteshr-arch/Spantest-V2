import { configureStore } from '@reduxjs/toolkit'
import spantestReducer from './spantestSlice'

export const store = configureStore({
  reducer: {
    spantest: spantestReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
