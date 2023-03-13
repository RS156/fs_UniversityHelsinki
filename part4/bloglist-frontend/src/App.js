import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Login from './components/Login'
import Utils from './components/Utils'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({info:null, className:null})

  useEffect(() => {
    const getData = async () =>{
      setBlogs (await blogService.getAll())      
    }  
    getData()
  }, [])


  useEffect(() => {
    const JsonUser = window.localStorage.getItem('loggedinBlogAppUser')

    if(JsonUser)
    {
      setUser(JSON.parse(JsonUser)) 
    }       
  }, [])

  console.log('render check', notification)

  const handleLogout =() => {
    window.localStorage.clear()
    setUser(null)
  }

  const setNotificationWithTimeout = (notification, time =5000) =>
  {
    console.log('in set notification', notification);
    setNotification(notification)
    setTimeout(()=>{
      setNotification({info:null, className:null})
    }, time)
  }

  const Blogs = () => (<div>
    <h2>blogs</h2>  
    <Utils.Notification info={notification.info} className={notification.className} />    
    <div>{user.name} logged in <button onClick={handleLogout}>logout</button></div>     
    <br />
    <CreateBlog blogsState={[blogs, setBlogs]} displayNotification={setNotificationWithTimeout}/>
    {blogs.map(blog =>
    <Blog key={blog.id} blog={blog} />)}

  </div> 
  )
  
  return (
    <div>     
      {!user && <Login userState={[user, setUser]} displayNotification={setNotificationWithTimeout}
      notificationState = {[notification, setNotification]}/>}
      {user && <Blogs />}
      </div>)     
} 

  

export default App