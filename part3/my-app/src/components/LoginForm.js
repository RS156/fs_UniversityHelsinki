import Utils from './Utils'
import { useState } from 'react'
import loginService from '../services/login'
import noteService from '../services/notes'
import PropTypes from 'prop-types'

const Input = Utils.Input

const LoginForm = ({ setUser, setErrorMessage }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  return (<form onSubmit={handleLogin} >
    <div>
            username
      <Input inputState={[username, setUsername]} type='text' id='username' />
    </div>
    <div>
            password
      <Input inputState={[password, setPassword]} type='password' id='password' />
    </div>
    <button id='login-button' type='submit'>login</button>
  </form>)
}

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setErrorMessage : PropTypes.func.isRequired
}

export default LoginForm