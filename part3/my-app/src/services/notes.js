import axios from "axios";

const baseUrl = '/api/notes'

const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExisting = {
        id : 10000,
        content : 'This note is not saved in server',
        important: true
    }
    return request.then(response => response.data.concat(nonExisting))
}

const create = newObj => axios.post(baseUrl, newObj)

const update = (id, newNoteObj) => axios.put(`${baseUrl}/${id}`, newNoteObj)

export default { getAll, create, update } 