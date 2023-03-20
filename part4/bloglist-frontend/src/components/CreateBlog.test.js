import CreateBlog from "./CreateBlog"
import { render, screen, fireEvent } from "@testing-library/react"
import '@testing-library/jest-dom/extend-expect';
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

describe('<CreateBlog />', () => {
    let container
    const blog = {
        "title": "blog post 6",
        "author": "Rishabh Sarkar",
        "url": "http://localhost:3003/api/blogs",
    }
    const mockOnCreate = jest.fn()
    beforeEach(()=> {        
        container = render(<CreateBlog onCreate={mockOnCreate} />).container
    })

    test('on clicking on newn note, create blog form is displayed', async ()=> {
        const user = userEvent.setup()
        const button = screen.getByText('new note')
        await user.click(button)

        const detailDiv =  container.querySelector('.togglableContent')                     
        expect(detailDiv).not.toHaveStyle('display: none')   
        const formDiv = container.querySelector('.togglableContent#createBlogForm') 
        expect(formDiv).toBeDefined()
    })

    test('Clicking create button calls function with right parameters', async ()=>{
        const user = userEvent.setup()
        const button = screen.getByText('new note')
        await user.click(button)

        const titleInp = container.querySelector('#titleInp')
        const authorInp = container.querySelector('#authorInp')
        const urlInp = container.querySelector('#urlInp')
        const createButton = screen.getByText('create')

        await user.type(titleInp, blog.title)
        await user.type(authorInp, blog.author)
        await user.type(urlInp, blog.url)
        await user.click(createButton)

        expect(mockOnCreate.mock.calls).toHaveLength(1)
        // expect(mockOnCreate.mock.calls[0]).toHaveLength(3)
        // expect(mockOnCreate.mock.calls[0][0]).toBe(blog.title)
        // expect(mockOnCreate.mock.calls[0][1]).toBe(blog.author)
        // expect(mockOnCreate.mock.calls[0][2]).toBe(blog.url)
        expect(mockOnCreate.mock.calls[0]).toHaveBeenCalledWith(blog.title, blog.author, blog.url)

    })
})