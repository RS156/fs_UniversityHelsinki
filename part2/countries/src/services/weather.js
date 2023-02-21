import axios from "axios"

const api_key = process.env.REACT_APP_API_KEY
//const baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=3d52f0c9f03b565dd9ee44f447f0749a&units=metric`
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getForCity = (city)=> axios.get(`${baseUrl}?q=${city}&appid=${api_key}&units=metric`)

const getIcon = (weatherData)=>{
    const url = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
    return url
}
export default { getForCity, getIcon}