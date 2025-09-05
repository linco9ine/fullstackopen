import { createSlice } from '@reduxjs/toolkit'
import anecdoteServices from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    create: (state, action) => {
      state.push(action.payload)
    },
    vote: (state, action) => {
      const anecdote = state.find(a => a.id === action.payload)
      if (anecdote) {
        anecdote.votes++
      }
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  }
})

export const { create, vote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteServices.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (anecdote) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteServices.createNew(anecdote)
    dispatch(create(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const res = await anecdoteServices.update({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch(vote(res.id))
  }
}

export default anecdoteSlice.reducer
