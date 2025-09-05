import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAll, updateAnecdote } from './services/anecdote'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReducer } from 'react'
import notificationReducer from './reducers/notification'
import NotificationContext from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    notificationDispatch({ type: 'MESSAGE', payload: `anecdote '${anecdote.content}' voted` })
    setTimeout(() => {
      notificationDispatch({ type: 'MESSAGE', payload: '' })
    }, 5000)
    console.log('vote')
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1
  })

  if (result.isLoading) {
    return <p>Loading...</p>
  }

  if (result.isError) {
    return <p>anecdote service not available due to problems in server</p>
  }

  const anecdotes = result.data

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
    </NotificationContext.Provider>
  )
}

export default App
