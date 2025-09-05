import  { createAnecdote } from '../services/anecdote'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import NotificationContext from '../NotificationContext'
import { useContext } from 'react'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (anecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notificationDispatch({ type: 'MESSAGE', payload: `anecdote '${anecdote.content}' added` })
      setTimeout(() => {
        notificationDispatch({ type: 'MESSAGE', payload: '' })
      }, 5000)
    },
    onError: (error) => {
      notificationDispatch({ type: 'MESSAGE', payload: error.response.data.error })
      setTimeout(() => {
        notificationDispatch({ type: 'MESSAGE', payload: '' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
