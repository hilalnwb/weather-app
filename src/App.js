import { useState } from "react";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./API";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    
    // Trigger fade-out animation
    setIsFetching(true);

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        // Wait 300ms for the screen to go transparent before swapping data
        setTimeout(() => {
          setCurrentWeather({ city: searchData.label, ...weatherResponse });
          setForecast({ city: searchData.label, ...forecastResponse });
          setIsFetching(false); // Trigger fade-in
        }, 300);
      })
      .catch((err) => {
        console.log(err);
        setIsFetching(false);
      });
  };

  let bgClass = "default-bg";
  if (currentWeather) {
    const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const cityTime = new Date(utc + (currentWeather.timezone * 1000));
    const hour = cityTime.getHours();

    if ((hour >= 5 && hour < 8) || (hour >= 17 && hour < 20)) {
      bgClass = "dawn-bg";
    } else if (hour >= 8 && hour < 17) {
      bgClass = "morning-bg";
    } else {
      bgClass = "night-bg";
    }
  }

  return (
    <div className={`app-background ${bgClass}`}>
      <div className="container">
        <Search onSearchChange={handleOnSearchChange} />

        {/* Content wrapper handles the opacity transition */}
        <div className={`content-wrapper ${isFetching ? "fade-out" : "fade-in"}`}>
          {currentWeather ? (
            <>
              <CurrentWeather data={currentWeather} />
              {forecast && <Forecast data={forecast} />}
            </>
          ) : (
            <div className="welcome-screen">
              <div className="welcome-text">
                <h1>Weather App</h1>
                <p className="welcome-subtext">Powered by OpenWeather</p>
                <a href="https://github.com/hilalnwb" target="_blank" rel="noreferrer" className="welcome-link">
                  github.com/hilalnwb
                </a>
              </div>

              <div className="welcome-divider"></div>

              <img src="icons/02n.png" alt="moon cloud icon" className="welcome-icon" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;