import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country, weather, iconUrl }) => {
  return (
    <div>
	  <h1>{country.name.common}</h1>
	  <p>Capital {country.capital}</p>
	  <p>Area {country.area}</p>
	  <h2>Languages</h2>
	  <ul>
	    {Object.values(country.languages).map(lang => <li key={lang} >{lang}</li>)}
	  </ul>
	  <img src={country.flags.png} alt={country.flags.alt} width={200} height={200} />
	  {weather && (
		<>
	    <h2>Weather in {country.capital}</h2>
	    <p>Temperature {weather.main.temp}</p>
	    <img src={iconUrl} />
	    <p>Wind {weather.wind.speed} m/s</p>
		</>
	  )}
	</div>
  );
}

const Countries = ({ countries, show }) => {
  return (
    <div>
	  {countries.map(country => <p key={country.cca3} >{country.name.common} <button onClick={() => show(country)} >Show</button></p>)}
	</div>
  );
}

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [weather, setWeather] = useState(null);
  const apiKey = import.meta.env.VITE_API_KEY

  useEffect(() => {
    axios
	  .get("https://studies.cs.helsinki.fi/restcountries/api/all")
	  .then(res => setCountries(res.data))
	  .catch(() => console.log("Error fetching the data"))
  }, []);

  useEffect(() => {
    setFilteredCountries(countries.filter(country => country.name.common.toLowerCase().includes(filterValue.toLowerCase())));
  }, [filterValue, countries]);

  const show = (c) => {
	setFilteredCountries([c]);
  }

  useEffect(() => {
    if (filteredCountries.length === 1) {
      axios
		.get(`https://api.openweathermap.org/data/2.5/weather?q=${filteredCountries[0].name.common}&appid=${apiKey}&units=metric`)
		.then(res => setWeather(res.data))
		.catch(() => console.log("Error fetching weather data"));
	}
  }, [filteredCountries]);

  return (
    <>
	  <div>
	    find countries <input value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
	    {
	      filteredCountries.length === 0
			? null
			: filteredCountries.length === 1
			    ? <Country country={filteredCountries[0]} weather={weather} iconUrl={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`}/>
			    : filteredCountries.length < 10
			        ? <Countries countries={filteredCountries} show={show} />
			        : <p>Too many matches. specify another filter</p>
		}  
	  </div>
	</>
  )
}

export default App
