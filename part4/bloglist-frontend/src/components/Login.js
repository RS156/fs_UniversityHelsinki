import { useState } from "react"
import loginService from '../services/login'
import blogService from '../services/blogs'
import Utils from "./Utils"

const Input = Utils.Input

const Login = ({userState, displayNotification, notificationState}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = userState
  const [notification, setNotification] = notificationState

  const handleLogin = async (event)=>{
    event.preventDefault()
    try {
        const loggedInUser = await loginService.login({username, password})
        window.localStorage.setItem('loggedinBlogAppUser', JSON.stringify(loggedInUser))  
        blogService.setToken(loggedInUser.token)       
        setUser(loggedInUser)      
        setUsername('')
        setPassword('')
    }
    catch(exception){
        displayNotification({info:`wrong user name or password. Error - ${exception.message}`, 
        className:'notification error'})
        setUsername('')
        setPassword('')
    }
    
  }
 return (
    <div>
        <h2>log in to the application</h2>
        <Utils.Notification info={notification.info} className={notification.className} /> 
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