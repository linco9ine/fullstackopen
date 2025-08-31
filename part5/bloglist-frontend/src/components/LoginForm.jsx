import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from './Notification'

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (err) {
      setErrorMessage(err.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>log in to application</h1>
      {errorMessage && <Notification msg={errorMessage} whatIsIt={1} />}
      <div>
        <label>
          username
          <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)} />
        </label>
      </div>

      <div>
        <label>
          password
          <input type='password' value={password} name='Password' onChange={({ target }) => setPassword(target.value)} />
        </label>
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm
