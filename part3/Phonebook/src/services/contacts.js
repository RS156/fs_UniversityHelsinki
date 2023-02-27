import axios from "axios";
const baseUrl = '/api/persons'

const getAll =() => axios.get(baseUrl)

const addPerson = (newObj) => axios.post(baseUrl, newObj)
const updatePerson = (oldP,newP) => {
    const personUrl = `${baseUrl}/${oldP.id}`
    return axios.put(personUrl,newP)
}

const deletePerson = (person) => {
    const personUrl = `${baseUrl}/${person.id}`
    return axios.delete(personUrl)
} 

export default {getAll, addPerson, deletePerson,updatePerson}
