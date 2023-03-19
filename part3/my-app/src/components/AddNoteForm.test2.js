import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import {render, screen} from '@testing-library/react'
import AddNoteForm from './AddNoteForm'
import axios from 'axios'

// test('<AddNoteForm /> updates parent state and calls onSubmit', async () => {
//     const createNote =jest.fn()
//     const user = userEvent.setup()

//     render(<AddNoteForm />)

//     const input = screen.getByRole('textbox')
//     const sendButton = screen.getByText('save')

//     await user.type(input, 'testing a form...')
//     await user.click(sendButton)



// })