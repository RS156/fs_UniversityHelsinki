import { useState} from 'react'
import Togglable from './Togglable'
import blogService from '../services/blogs'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}
const buttonStyle = {
  marginLeft: 2  
}

const BlogTitle = ({ blog, onToggle }) => {   

  return <div style={blogStyle}>
    {blog.title}  {blog.author} 
    <button onClick={onToggle} style={buttonStyle}>view</button>
  </div>
}

const BlogDetail =  ({ blog, user, onToggle, blogsState }) => {

  const [blogs, setBlogs] = blogsState

  const removeBlog = async () => {
    if(window.confirm(`remove blog ${blog.title} by ${blog.author}`))
    {   
        await blogService.deleteOne(blog.id)
        setBlogs(await blogService.getAll())
    }
  }
  return <div style={blogStyle}>
    <div>{blog.title} {blog.author}
    <button onClick={onToggle} style={buttonStyle}>hide</button></div> 
    <div>{blog.url}</div>
    <Likes blog={blog} />
    {blog.user && <div>{blog.user.name}</div>}
    { (user.username === blog.user?.username) &&
    <div><button onClick={removeBlog} style={buttonStyle}>remove</button></div>
    }
  </div>
}

const Likes= ({blog}) => {
  const [likes, setLikes] = useState(blog.likes)

  const addLike = async () => {
    const request = blog
    request.likes=request.likes + 1
    request.user = request.user?._id
    const response = await blogService.update(blog.id, request)
    setLikes(response.likes)
  }
  return (
    <div>likes {likes}
    <button onClick={addLike} style={buttonStyle}>like</button></div>
  )
} 



const Blog = ({ blog, user, blogsState }) => {
  return (<Togglable header={<BlogTitle blog={blog} />}>
    <BlogDetail blog={blog} user={user} blogsState={blogsState} />
  </Togglable>)
}



export default Blog