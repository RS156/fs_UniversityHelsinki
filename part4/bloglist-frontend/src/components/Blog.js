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

  return <div style={blogStyle} className='blogTitle'>
    {blog.title}  {blog.author} 
    <button onClick={onToggle} style={buttonStyle}>view</button>
  </div>
}

const BlogDetail =  ({ blog, user, onToggle, onDelete, onLike }) => {

  //const [blogs, setBlogs] = blogsState

  const removeBlog = () => {
   onDelete(blog)
  }
  return <div style={blogStyle} className='blogDetail'>
    <div>{blog.title} {blog.author}
    <button onClick={onToggle} style={buttonStyle}>hide</button></div> 
    <div>{blog.url}</div>
    <Likes blog={blog} onLike={onLike} />
    {blog.user && <div>{blog.user.name}</div>}
    { (user.username === blog.user?.username) &&
    <div><button onClick={removeBlog} style={buttonStyle}>remove</button></div>
    }
  </div>
}

const Likes= ({blog, onLike}) => {
  const [likes, setLikes] = useState(blog.likes)

  return (
    <div className='blogLikesContainer'>likes {likes}
    <button onClick={()=>{onLike(blog,setLikes)}} style={buttonStyle}>like</button></div>
  )
} 



const Blog = ({ blog, user, onDelete, onLike }) => {
  const [visible, setVisible] = useState(false)
  return (<Togglable visibleState={[visible, setVisible]} className='blogContainer' header={<BlogTitle blog={blog} />}>
    <BlogDetail blog={blog} user={user} onDelete={onDelete} onLike={onLike} />
  </Togglable>)
}



export default Blog