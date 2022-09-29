import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './anecdoteReducer'
import notificationReducer from './notificationReducer'
import filterReducer from './filterReducer'

export const store = configureStore({
  reducer: { 
    anecdotes: anecdoteReducer,
    notification: notificationReducer,
    filter: filterReducer
  }
})