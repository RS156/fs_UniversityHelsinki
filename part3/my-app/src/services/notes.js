import axios from "axios";

const baseUrl = '/api/notes'
let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    const nonExisting = {
        id: 10000,
        content: 'This note is not saved in server',
        important: true
    }
    return request.then(response => response.data.concat(nonExisting))
}

const create = (newObj) => {
    const config = {
        headers : {Authorization : token}
    }
    return axios.post(baseUrl, newObj,config)

}

const update = (id, newNoteObj) => axios.put(`${baseUrl}/${id}`, newNoteObj)

export default { getAll, create, update, setToken } 