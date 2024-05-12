import React, {useState, useEffect} from 'react';
import '../styles/Weather.css';

export const Weather = () => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    console.log(API_KEY);
    const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
    console.log(NEWS_API_KEY);

    const [location, setLocation] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [hourlyData, setHourlyData] = useState(null);
    const [dailyData, setDailyData] = useState(null);
    const [newsData, setNewsData] = useState(null);

    // getting latitude and longitude
    useEffect(() => {
        const fetchLocationInput = async () => {
            const url = new URL("http://api.openweathermap.org/geo/1.0/direct?");
            url.searchParams.append("q", location);
            url.searchParams.append("appid", API_KEY);
            const response = await fetch(url);
            const data = await response.json();
            setCoordinates({lat: data.lat, lon: data.lon});
        }
        if (location !== '') {
            fetchLocationInput();
        }
    }, [])

    // getting current weather data
    useEffect(() => {
        const fetchWeatherData = async () => {
            const url = new URL("https://api.openweathermap.org/data/2.5/weather?")
            url.searchParams.append("lat", coordinates.lat);
            url.searchParams.append("lon", coordinates.lon);
            url.searchParams.append("units", "imperial");
            url.searchParams.append("appid", API_KEY);
            
            const response = await fetch(url);
            const data = await response.json();
            setCurrentWeather(data);
        }
        fetchWeatherData();
    }, [])


    // getting hourly forecast data
    useEffect(() => {
        const fetchHourlyData = async () => {
            const url = new URL("https://pro.openweathermap.org/data/2.5/forecast/hourly?");
            url.searchParams.append("lat", coordinates.lat);
            url.searchParams.append("lon", coordinates.lon);
            url.searchParams.append("appid", API_KEY);
            const response = await fetch(url);
            const data = response.json();
            setHourlyData(data);
        }
        fetchHourlyData();
    }, [])

    // getting daily forecasts for next week
    useEffect(() => {
        const fetchDailyData = async () => {
            const url = new URL("https://api.openweathermap.org/data/2.5/forecast/daily?");
            url.searchParams.append("lat", coordinates.lat);
            url.searchParams.append("lon", coordinates.lon);
            url.searchParams.append("cnt", "7");
            url.searchParams.append("appid", API_KEY);
            const response = await fetch(url);
            const data = response.json();
            setDailyData(data);
        }
        fetchDailyData();
    }, [])

    // getting news data
    useEffect(() => {
        const fetchNewsData = async () => {
            const url = new URL("https://api.nytimes.com/svc/mostpopular/v2/emailed/7.json?");
            url.searchParams.append("api-key", NEWS_API_KEY);
            const response = await fetch(url);
            const data = response.json();
            setNewsData(data);
        }
        fetchNewsData();
    }, [])

    // handles changes in user input
    const handleChange = (input) => {
        setLocation(input.target.value);
    }

    // display everything when button is clicked
    const handleClick = () => {
        // setShowLocationData(true);
        if (location !== '') {
            setCoordinates(null);
        }
    }

    return (
        <> 
            <h1> Weather App </h1>
            <input type="text" value={location} onChange={handleChange} placeholder='Enter Location'/>
            <button type="submit" onClick={() => handleClick()}> Get Weather & News </button>
            {coordinates && (
                <div> 
                    <p> Latitude: {coordinates.lat} </p>
                    <p> Longitude: {coordinates.lon} </p>
                </div>
            )}

            {/* current weather forecast */}
            {currentWeather && (
                <div className="container">
                    <div className="top">
                        <div className="location">
                            <p>{currentWeather.name}</p>
                        </div>
                        <div className="weatherIcon"> 
                            <img 
                                src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
                                alt={currentWeather.weather[0].main}
                             />
                        </div>
                        <div className="temp">
                            {currentWeather.main ? <h1>{currentWeather.main.temp.toFixed()}°F</h1> : null}
                            <p> Current Temp: </p>
                            {currentWeather.main ? <h4>{currentWeather.main.feels_like.toFixed()}°F</h4> : null}
                            <p>Feels Like: </p>
                        </div>
                        <div className="description">
                            {currentWeather.weather ? <p>{currentWeather.weather[0].main}</p> : null}
                            {currentWeather.weather ? <p>{currentWeather.weather[0].description}</p> : null}
                            <p> Conditions: </p>
                        </div>
                    </div>
                </div>
            )}

            {/* hourly forecast for next day */}
            <div className="container"> 
                {hourlyData && hourlyData.list.slice(0, 24).map(hourly => (
                    <> 
                        <div className="weatherIcon"> 
                            <img 
                                src={`http://openweathermap.org/img/w/${hourly.weather[0].icon}.png`}
                                alt={hourly.weather[0].main}
                            />
                        </div>
                        <div className="temp"> 
                            {hourly.main ? <h1>{hourly.main.temp.toFixed()}°F</h1> : null}
                            <p> Current Weather: </p>
                            {hourly.weather ? <p>{hourly.weather[0].description}</p> : null}
                            <p> Conditions: </p>
                        </div> 
                    </>
                ))}
            </div>

            {/* daily forecast for next week */}
            <div className="container"> 
                {dailyData && dailyData.list.slice(0, 7).map(daily => (
                    <> 
                        <div className="weatherIcon"> 
                            <img 
                                src={`http://openweathermap.org/img/w/${daily.weather[0].icon}.png`}
                                alt={daily.weather[0].main}
                            />
                        </div>
                        <div className="temp"> 
                            {daily.temp ? <h2>{daily.temp.day.toFixed()}°F</h2> : null}
                            <p> Day Temp: </p>
                            {daily.temp ? <h2>{daily.temp.night.toFixed()}°F</h2> : null}
                            <p> Night Temp: </p>
                            {daily.temp ? <h3>{daily.temp.min.toFixed()}°F</h3> : null}
                            <p> Low: </p>
                            {daily.temp ? <h3>{daily.temp.max.toFixed()}°F</h3> : null}
                            <p> High: </p>
                            {daily.weather ? <p>{daily.weather[0].description}</p> : null}
                            <p> Conditions: </p>
                        </div> 
                    </>
                ))}
            </div>

            <div className="container"> 
                {newsData && newsData.results.slice(0, 7).map(dailyNews => (
                    <div className="temp"> 
                        {dailyNews.title}
                        <p> Headline: </p>
                        {dailyNews.byline}
                        <p> Author: </p>
                        {dailyNews.abstract}
                        <p> Description </p>
                        <p> {dailyNews.url} </p>
                    </div> 
                ))}
            </div>
        </>
    )

}


