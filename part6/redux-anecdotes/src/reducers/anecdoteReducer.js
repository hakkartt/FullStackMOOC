import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    create(state, action) {
      state.push(action.payload)
    },
    vote(state, action) {
      const id = action.payload
      const toBeUpdated = state.find(i => i.id === id)
      const updated = {
        ...toBeUpdated,
        votes: toBeUpdated.votes + 1
      }
      return state.map(
          i => i.id !== id ? i : updated
        ).sort((i, j) => j.votes - i.votes)
    },
    setup(state, action) {
      return action.payload
    }
  }
})

export const init = () => {
  return async dispatch => {
    dispatch(setup(await anecdoteService.getAllAnecdotes()))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    dispatch(
      create(
        await(
          anecdoteService.createAnecdote(content)
          )
      )
    )
  }
}

export const { create, vote, setup } = anecdoteSlice.actions
export default anecdoteSlice.reducer