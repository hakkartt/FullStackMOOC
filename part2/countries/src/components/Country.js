import { useState, useEffect } from "react"
import axios from 'axios'

const Country = ({ data, API_KEY }) => {

    const country = data[0]
    const [weather, setWeather] = useState({
        main: {temp: 0},
        wind: {speed: 0},
        weather: [{icon: "10d"}]
    })
    const capital = country.capital

    const hook = () => {
        axios
            .get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=imperial&appid=${API_KEY}`)
            .then(response => {
            setWeather(response.data)
            })
        }

    useEffect(hook, [])

    return (
        <>
            <h1>{country.name.common}</h1>
            <p>
                capital {country.capital} <br></br> 
                area {country.area}
            </p>
            <h2>languages</h2>
            <ul>
                {Object.values(country.languages).map(
                    (x, i) => <li key={i}>{x}</li> )}
            </ul>
            <img src={country.flags.png} alt="The flag of the country"></img>
            <h2>Weather in {country.capital}</h2>
            <p>temperature {((weather.main.temp - 32) / 1.8).toFixed(2)} Celsius</p>
            <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather icon"></img>
            <p>wind {(0.44704 * weather.wind.speed).toFixed(2)} m/s</p>
        </> 
        
    )
}

export default Country