import Utils from './Utils'
import { useState } from "react";
import loginService from '../services/login'
import noteService from '../services/notes'

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
            setErrorMessage(`Wrong credentials`)
            setTimeout(() => { setErrorMessage(null) }, 5000)
        }
    }

    return (<form onSubmit={handleLogin} >
        <div>
            username
            <Input inputState={[username, setUsername]} type='text' />
        </div>
        <div>
            password
            <Input inputState={[password, setPassword]} type='password' />
        </div>
        <button type='submit'>login</button>
    </form>)
}

export default LoginForm