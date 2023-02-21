import { useEffect, useState } from "react";
import countryService from './services/countries'
import weatherService from './services/weather'

//($env:REACT_APP_API_KEY="3d52f0c9f03b565dd9ee44f447f0749a") -and (npm start)

const Countries = ({ value, setValue }) => {
  if (value === null) {
    return (
      <div>Please enter country name</div>
    )
  }
  if (value.length > 10) {
    return (
      <div>Too many countries, specify another filter</div>
    )
  }
  if (value.length > 1) {
    const handleClick =(country)=>()=>{
      setValue([country])
    }
    return (
      <div>
        {value.map((c) => {
          return <div key={c.cca2}>{c.name.common}
          <button onClick={handleClick(c)}>show</button></div>
        })}
      </div>
    )
  }
  if (value.length === 1) {
    return (
      <CountryDetail country={value[0]} />
    )
  }

  return (
    <div>Error - unhandled output</div>
  )
}

const CountryDetail = ({ country }) => {
  console.log(country.languages);
  const [weatherData, setWeatherData]  = useState(null)
  const hook = () => {
    weatherService
    .getForCity(country.capital[0])
    .then(response => {setWeatherData(response.data)})

  }
  useEffect(hook, [])
 
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital  {country.capital[0]}</div>
      <div>area  {country.area}</div>
      <br />
      <div><b>languages</b>
        <ul>
          {Object.values(country.languages)
            .map(lang => <li>{lang}</li>)}
        </ul></div>
      <img src={country.flags.png} width='150' height='150' />
      <WeatherDetail weatherForCity={weatherData} />
    </div>
  )
}



const WeatherDetail =({weatherForCity}) => {
  if(weatherForCity===null)
  {
    return null
  }
  return (
    <div>
      <h2>Weather in {weatherForCity.name}</h2>
      <div>temperature {weatherForCity.main.temp} Celcius</div> 
      <img src={weatherService.getIcon(weatherForCity)}/>
      <div>wind {weatherForCity.wind.speed} m/s</div> 
    </div>   
  )
}

function App() {
  // const api_key = process.env.REACT_APP_API_KEY
  // console.log(api_key);

  const [countries, setCountries] = useState(null)
  const [userInput, setUserInput] = useState('')
  const handleChange = (e) => {
    setUserInput(e.target.value)
  }
  console.log(countries);

  const hook = () => {
    if (userInput != '') {
      countryService
        .getAll()
        .then(response => {
          setCountries(response.data
            .filter(c => c.name.common.toLowerCase().includes(userInput.toLowerCase())))
        })
    }
    else {
      setCountries(null)
    }

  }

  useEffect(hook, [userInput])

  return (
    <div>
      <div>
        find countries
        <input value={userInput} onChange={handleChange} />
      </div>
      <Countries value={countries} setValue={setCountries} />
    </div>
  );
}

export default App;
