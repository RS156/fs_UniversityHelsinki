import { useState } from "react"
import Utils from "./Utils"
import blogService from '../services/blogs'

const Input = Utils.Input

const CreateBlog = ({blogsState}) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [blogs, setBlogs] = blogsState   
  
  const createBlog = async (event) =>{
    event.preventDefault()
    const response = await blogService.create({title, author, url})
    setBlogs(await blogService.getAll()) 
    setTitle('')
    setAuthor('')
    setUrl('')
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
    </div>
 )
}

export default CreateBlog