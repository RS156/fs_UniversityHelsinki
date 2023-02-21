import axios from "axios";
const baseUrl ='https://restcountries.com/v3.1/all'

const getAll = () => axios.get(baseUrl)


export default {getAll}