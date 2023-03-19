import { useState } from "react"
import Utils from "./Utils"
import blogService from '../services/blogs'
import Togglable from "./Togglable"

const Input = Utils.Input

const CreateBlogBody = ({blogsState, displayNotification, blogFormRef, onToggle}) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [blogs, setBlogs] = blogsState  
  
  
  const createBlog = async (event) =>{
    event.preventDefault()
    try{
      const response = await blogService.create({title, author, url})
      displayNotification({info:`a new blog '${response.title}' by ${response.author} added`, 
      className:'notification'})
    setBlogs(await blogService.getAll()) 
    setTitle('')
    setAuthor('')
    setUrl('')    
    }
    catch(exception)
    {
      displayNotification({info:`blog was not added. Message ${exception.message}`, 
      className:'notification error'})
    }
    blogFormRef.current.toggleVisibility()    
  }
  
 return (
    <div>
        <h2>create new</h2>
      <div>
        title:<Input inpState={[title, setTitle]} type ='text' />
      </div>
      <div>
        author:<Input inpState={[author, setAuthor]} type ='text' />
      </div>
      <div>
        url:<Input inpState={[url, setUrl]} type ='text' />
      </div>
      <button onClick={createBlog}>create</button>
      <div>
      <button onClick={onToggle}>cancel</button>      
      </div>      
    </div>
 )
}

const Header = ({onToggle}) => (
  <button onClick={onToggle}>new note</button>
)
const CreateBlog = ({blogsState, displayNotification, blogFormRef}) =>(
<Togglable  header={<Header />}>
    <CreateBlogBody blogsState={blogsState} displayNotification={displayNotification}
    blogFormRef={blogFormRef}/>
    </Togglable>
)


export default CreateBlog