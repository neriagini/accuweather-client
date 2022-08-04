import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Clock from './components/Clock';

const KEY = 'b9qlnPQZvXqa7GdY9JTN9aqQoISsyeHi'

function App() {

  const [events, setEvents] = useState([]);
  const [time, setTime] = useState(new Date());
  
  // text field
  const [location, setLocation] = useState(null);
  // city object with with timezone prop
  const [city, setCity] = useState(null)


  // array of cities - without timezone prop
  // for each city - fetch the full object using name and getLocationKey
  const [cities, setCities] = useState([]);
  // array of selected cities
  const [selectedCities, setSelectedCities] = useState([]);


  useEffect(
    () => {
      const intervalId = setInterval(() => {
      
        setTime(new Date());
      }, 1000);
      return () => {
        clearInterval(intervalId)
      }
    } 
  )

  const onLocationChange = (event) => {
    setLocation(event.target.value)
  }

  const onCitiesChange = async (event) => {
    if (event.target.value) {
      await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=b9qlnPQZvXqa7GdY9JTN9aqQoISsyeHi&q=${event.target.value}`)
      .then(response => {
        console.log(response.data);
        setCities(response.data)
      })
    } else {
      setCities([])
    }
  }

  const getEvents = async () => {
      await axios.get('http://localhost:8080/list-events').then(response => {
        console.log(response)
      })
  }

  const getLocationKey = async () => {
    await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${KEY}&q=${location}`)
    .then(response => {
      console.log(response.data)
      setCity(response.data[0])
    })
  }

  const getCityObject = async (name) => {
    let city = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${KEY}&q=${name}`)
    .then(response => {
      return(
        response.data[0]
        )
    })
    return city;
  }

  // const getTodayForcast = async (locationKey) => {
  //     await axios.get(`url`)
  //       .then(response => {
  //         console.log(response)
  //       }) 
  // }

  const handleSelect = async (event) => {
    const city = await getCityObject(event.target.value);
    setSelectedCities(prev => [...prev, city ])
  }

  return (
    <div className="App">
        <div>
          <p className='text-[25px] font-bold m-10'> Google Calendar API </p>
          <button className='text-white border-2 p-2 rounded-xl bg-blue-500' onClick={getEvents}> Fetch Events </button>
        </div>
        <div className='space-x-2'>
          <p className='text-[25px] font-bold m-10'> AccuWeather API </p>
          <input type='text' placeholder='Enter location...'  onChange={onLocationChange} className='border-2 p-2 rounded-xl'/>
          <button className='text-white border-2 p-2 rounded-xl bg-blue-500' onClick={getLocationKey}> Fetch Location Key </button>
          <p className='font-bold'> location key: { city && city.Key} </p>
          <p> using the location key for fetching weather forcast for this location </p>
        </div>
        <div className='space-x-2'>
          <p className='text-[25px] font-bold m-10'> Auto-Complete City Search </p>
          <input type='text' placeholder='Search city...'  onChange={onCitiesChange} className='border-2 p-2 rounded-xl'/>

          <select onChange={handleSelect} value={'default'} className='text-white border-2 p-2 rounded-xl bg-blue-500' name="cities" id="cities">
            <option value={"default"} disabled> Add a city </option>
            {
              cities.map((city,index) => {
                return(
                  <option value={city.LocalizedName} key={index}> {city.LocalizedName} </option>
                )
              })
            }
          </select>
        </div>

        <div>
            <p className='font-bold'> selected cities: </p>
            {
              selectedCities.map((city, index) => {
                return(
                  <p key={index}> {city.LocalizedName} </p>
                )
              })
            }           
        </div>
        <div className='flex flex-row justify-center m-10'>
            {
              selectedCities.map((city,index) => {
                return(
                  <Clock key={index} time={time} city={city.LocalizedName} tz={city.TimeZone.Name} />
                )
              })
            }
        </div>
    </div>
  );
}

export default App;