import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import CreateBlog from './components/CreateBlog'
import Login from './components/Login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  
  useEffect(async () => {
    setBlogs(await blogService.getAll())     
    
  }, [])

  useEffect(() => {
    const JsonUser = window.localStorage.getItem('loggedinBlogAppUser')

    if(JsonUser)
    {
      setUser(JSON.parse(JsonUser)) 
    }
  }, [])

  const handleLogout =() => {
    window.localStorage.clear()
    setUser(null)
  }

  const Blogs = () => (<div>
    <h2>blogs</h2>    
    <div>{user.name} logged in <button onClick={handleLogout}>logout</button></div>     
    <br />
    <CreateBlog blogsState={[blogs, setBlogs]}/>
    {blogs.map(blog =>
    <Blog key={blog.id} blog={blog} />)}

  </div> 
  )
  
  return (
    <div>
      {!user && <Login userState={[user, setUser]}/>}
      {user && <Blogs />}
      </div>)     
} 

  

export default App