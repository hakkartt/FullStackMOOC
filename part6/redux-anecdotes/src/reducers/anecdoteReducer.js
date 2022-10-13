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
      return state.map(
          i => i.id !== action.payload.id ? i : action.payload
        ).sort((i, j) => j.votes - i.votes)
    },
    setup(state, action) {
      return action.payload.sort((i, j) => j.votes - i.votes)
    }
  }
})

export const voteAnecdote = (id) => {
  return async dispatch => {
    dispatch(vote(await anecdoteService.incrementVotes(id)))
  }
}

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