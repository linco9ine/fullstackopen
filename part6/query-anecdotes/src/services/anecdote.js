import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const createAnecdote = async (newAnecdote) => {
  const res = await axios.post(baseUrl, newAnecdote)
  return res.data
}

const updateAnecdote = async (updatedAnecdote) => {
  const res = axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
  return res.data
}

export { getAll, createAnecdote, updateAnecdote }
