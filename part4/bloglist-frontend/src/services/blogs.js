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

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, setToken }