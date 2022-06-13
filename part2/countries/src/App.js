import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [showAll, setShowAll] = useState(true)
  const [filter, setFilter] = useState('')

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  const api_key = process.env.REACT_APP_API_KEY

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setShowAll(false)
  }

  const handleButtonPress = (x) => {
    setFilter(x)
  }

  const countriesToShow = showAll
    ? countries
    : countries.filter(x =>
       x.name.common.toLowerCase().includes(filter.toLowerCase()))
  
  return (
    <div>
      <Filter v={filter} f={handleFilterChange}/>
      <Countries 
        data={countriesToShow}
        button={handleButtonPress}
        API_KEY={api_key}
      />
    </div>
  )

}

export default App
