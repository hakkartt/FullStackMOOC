import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './anecdoteReducer'

export const store = configureStore({
  reducer: { anecdotes: anecdoteReducer}
})