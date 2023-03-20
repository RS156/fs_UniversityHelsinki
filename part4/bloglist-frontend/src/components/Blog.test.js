import { render, screen, fireEvent } from "@testing-library/react"
import '@testing-library/jest-dom/extend-expect';
import Blog from "./Blog"
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

jest.mock('../services/blogs')

describe('<Blog />', () =>{

    let container
    const mockOnLike = jest.fn()
    const blog = {
        "title" : "blog post 6",
        "author" : "Rishabh Sarkar",
        "url" : "http://localhost:3003/api/blogs",
        "likes" : 11,
        "user" : "6404ecf83ebcc248e34d20a6"
    }
    const user = {
        "username" : "rs121",
        "name" : "rishabh",
        "password": "Password"
    }  
    beforeEach(()=>{       
          

        const mockHandler = jest.fn()

        container = render(<Blog blog={blog} user={user} onDelete={mockHandler} onLike={mockOnLike}/>).container
    })

    test('renders blog title and author, but not url and likes by default', async ()=>{


        const titleDiv =  container.querySelector('.togglableHeader')  
        expect(titleDiv).toHaveTextContent(blog.title)
        expect(titleDiv).toHaveTextContent(blog.author)
        expect(titleDiv).not.toHaveTextContent(blog.url)
        expect(titleDiv).not.toHaveTextContent(`likes ${blog.likes}`)
        expect(titleDiv).not.toHaveStyle('display: none')

        const detailDiv =  container.querySelector('.togglableContent')   
        expect(detailDiv).toHaveTextContent(blog.title)
        expect(detailDiv).toHaveTextContent(blog.author)
        expect(detailDiv).toHaveTextContent(blog.url)
        expect(detailDiv).toHaveTextContent(`likes ${blog.likes}`)    
        expect(detailDiv).toHaveStyle('display: none')   
     
    })

    test('on clicking view button, renders url and likes ', async ()=>{
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)


        const detailDiv =  container.querySelector('.togglableContent')   
        expect(detailDiv).toHaveTextContent(blog.title)
        expect(detailDiv).toHaveTextContent(blog.author)
        expect(detailDiv).toHaveTextContent(blog.url)
        expect(detailDiv).toHaveTextContent(`likes ${blog.likes}`)    
        expect(detailDiv).not.toHaveStyle('display: none')   

     
    })

    test('on clicking like button twice', async ()=>{
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        

        const likeButton = screen.getByText('like')
        
        await act(async () =>{
            fireEvent.click(likeButton)
            fireEvent.click(likeButton)
        })        
        expect(mockOnLike).toHaveBeenCalledTimes(2)     
    })






})

