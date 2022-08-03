import './App.css';
import axios from 'axios';
import { useState } from 'react';


function App() {

  const [location, setLocation] = useState("tel aviv");

  const onLocationChange = (event) => {
    setLocation(event.target.value);
  }

  const getEvents = async () => {
      await axios.get('http://localhost:8080/list-events').then(response => {
        console.log(response)
      })
  }
  const getLocationKey = async () => {
    await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=b9qlnPQZvXqa7GdY9JTN9aqQoISsyeHi&q=${location}`)
    .then(response => {
      console.log(response.data)
    })
  }
  return (
    <div className="App">
      <p className='text-[25px] font-bold m-10'> Google Calendar API </p>
      <button className='text-white border-2 p-2 rounded-xl bg-blue-500' onClick={getEvents}> Fetch Events </button>
      <p className='text-[25px] font-bold m-10'> AccuWeather API </p>
      <input type='text' placeholder='Enter location...'  onChange={onLocationChange} className='border-2 p-2 rounded-xl'/>
      <button disabled className='text-white border-2 p-2 rounded-xl bg-blue-500' onClick={getLocationKey}> Fetch Location Key </button>
    </div>
  );
}

export default App;