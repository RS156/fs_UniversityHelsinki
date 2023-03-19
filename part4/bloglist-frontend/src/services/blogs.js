import axios from 'axios'
const baseUrl = '/api/blogs'
let token = ''

const setToken = userToken =>{
  token=userToken
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async blog => {
  const config ={
   headers : {Authorization : `Bearer ${token}`}
  }  
  console.log(config);
  const response = await axios.post(baseUrl, blog, config)

  return  response.data
}

const update= async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const deleteOne= async (id) => {
  const config ={
    headers : {Authorization : `Bearer ${token}`}
   } 
  const response = await axios.delete(`${baseUrl}/${id}`,config)
  return response
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, setToken, update, deleteOne }