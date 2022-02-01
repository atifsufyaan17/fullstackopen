import React, { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [search, setSearch] = useState("")
  const [countries, setCountries] = useState([])
  const [temp, setTemp] = useState(-9999)
  const [wind, setWind] = useState(-9999)
  const api_key = process.env.REACT_APP_API_KEY
  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        setCountries(response.data)
      })
  }
  useEffect(hook,[])
  
  const countriesToShow = countries.filter((country) => {
    return country.name.common.toLowerCase().includes(search.toLowerCase())
  })
  let display = ""

  if(countriesToShow.length == 1){
    display = countriesToShow.map((country) => {
      const lang = Object.values(country.languages).map(lan => <li>{lan}</li>)  
      let temp = -9999, wind = -9999
      return (
        <div>
          <h2>{country.name.common}</h2>
          <div>Capital {country.capital}</div>
          <div>Population {country.population}</div>
          <h3>Languages</h3>
          <ul>
            {lang}
          </ul>
          <img src={country.flags.png}/>
          <h3>Weather in {country.capital}</h3>
          <div>temperature {temp} F</div>
          <div>wind {wind} mph</div>
        </div>
      )
    })
  }
  else if(countriesToShow.length < 10){
    display = countriesToShow.map((country) => {
      return <li key={country.name.common}>{country.name.common} <button onClick={() => setSearch(country.name.common)}>show</button></li>
    })
  }
  else{    
    display = 'Too many countries, specify another filter'
  }

  return (
    <div>
      <a>find countries <input value={search} onChange={(event) => {setSearch(event.target.value)}}/></a>
      <div>
        {display}
      </div>
    </div>
  )
}

export default App