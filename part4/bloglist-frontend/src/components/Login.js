import { useState } from "react"
import loginService from '../services/login'
import blogService from '../services/blogs'
import Utils from "./Utils"

const Input = Utils.Input

const Login = ({userState}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = userState

  const handleLogin = async (event)=>{
    event.preventDefault()
    try {
        const loggedInUser = await loginService.login({username, password})
        window.localStorage.setItem('loggedinBlogAppUser', JSON.stringify(loggedInUser))
        setUser(loggedInUser)
        blogService.setToken(user.token)
        setUsername('')
        setPassword('')
    }
    catch(exception){
        console.log('Wrong credentials');
        setUsername('')
        setPassword('')
    }
    
  }
 return (
    <div>
        <h2>log in to the application</h2>
      <div>
        username<Input inpState={[username, setUsername]} type ='text' />
      </div>
      <div>
        password<Input inpState={[password, setPassword]} type ='password' />
      </div>
      <button onClick={handleLogin}>login</button>
    </div>
 )
}

export default Login