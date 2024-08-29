import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Input, Button, DatePicker} from 'antd';
import './App.css'; 
import Farmer from './components/Farmer';
import EventPlanner from './components/EventPlanner';
import Traveler from './components/Traveler';
import moment from 'moment';



function WeatherDashboard() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [city, setCity] = useState('');
  const [isCelsius, setIsCelsius] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
    });
  }, []);

  const fetchWeather = async (lat, lon) => {
    try {
      const apiKey = '41f3f75e227138c0e7e2a24c31ed5be5';
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setCurrentWeather(currentWeatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const dailyForecast = formatForecastData(forecastResponse.data.list);
      setForecast(dailyForecast);
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    try {
      const apiKey = '41f3f75e227138c0e7e2a24c31ed5be5';
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      setCurrentWeather(currentWeatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const dailyForecast = formatForecastData(forecastResponse.data.list);
      setForecast(dailyForecast);
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  };

  const formatForecastData = (data) => {
    const groupedData = data.reduce((acc, entry) => {
        const date = entry.dt_txt.split(' ')[0]; 
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(entry);
        return acc;
    }, {});

    return Object.keys(groupedData).map((date) => {
        const dailyData = groupedData[date];
        const tempAvg = dailyData.reduce((sum, entry) => sum + entry.main.temp, 0) / dailyData.length;
        const roundedTemp = Math.round(tempAvg);
        const weatherDesc = dailyData[0].weather[0].description;
        return {
            date,
            temp: roundedTemp,
            description: weatherDesc,
            icon: dailyData[0].weather[0].icon,
            wind: dailyData[0].wind.speed,
            humidity: dailyData[0].main.humidity,
        };
    });
};

const handleCitySearch = () => {
  fetchWeatherByCity(searchCity);
  setSearchCity('');
};

const handleDateChange = (date) => {
  setSelectedDate(date ? moment(date).format('YYYY-MM-DD') : null);
};

  const getWeatherEmoji = (icon) => {
    switch (icon) {
      case '01d': return '☀️'; // Clear sky day
      case '01n': return '🌙'; // Clear sky night
      case '02d': return '🌤'; // Few clouds day
      case '02n': return '🌤'; // Few clouds night
      case '03d':
      case '03n': return '☁️'; // Scattered clouds
      case '04d':
      case '04n': return '☁️'; // Broken clouds
      case '09d':
      case '09n': return '🌧'; // Shower rain
      case '10d': return '🌦'; // Rain day
      case '10n': return '🌧'; // Rain night
      case '11d':
      case '11n': return '⛈'; // Thunderstorm
      case '13d':
      case '13n': return '❄️'; // Snow
      case '50d':
      case '50n': return '🌫'; // Mist
      default: return '❓'; // Unknown
    }
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };
  const convertTemperature = (temp) => {
    return isCelsius ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);
  };

  return (
    <div className="weather-dashboard" style={{ padding: '20px' }}>
      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <Input
          placeholder="Search for a city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          style={{ width: '80%', marginRight: '10px' }}
        />
        <Button onClick={handleCitySearch}>Search</Button>
        <Button onClick={toggleTemperatureUnit}  style={{ marginLeft: '20px' }}>
            Switch to °{isCelsius ? 'F' : 'C'}
          </Button>
      </div>
      
    
          {currentWeather && (
        <Card title={`Weather in ${currentWeather.name || city}`} className="current-weather-card">
          <Row gutter={16}>
            <Col span={12} className="current-weather-main">
              <div className="weather-time">{new Date().toLocaleTimeString()}</div>
              <div className="weather-condition">{currentWeather.weather[0].description}</div>
              <div className="weather-temp">
                {convertTemperature(currentWeather.main.temp)}°{isCelsius ? 'C' : 'F'}
              </div>
            </Col>
            <Col span={12} className="weather-details">
              <div className="weather-feels-like">
                Feels like {convertTemperature(currentWeather.main.feels_like)}°
              </div>
              <div className="weather-wind">
                Wind: 💨 {currentWeather.wind.speed} km/h
              </div>
              <div className="weather-humidity">
                Humidity: 💧 {currentWeather.main.humidity}%
              </div>
              <div className="weather-visibility">
                Visibility: 👀 {currentWeather.visibility / 1000} km
              </div>
              <div className="weather-pressure">
                Pressure: 🎈 {currentWeather.main.pressure} mb
              </div>
              <div className="weather-dew-point">
                Dew point: 🌡️ {convertTemperature(currentWeather.main.temp - ((100 - currentWeather.main.humidity) / 5))}°
              </div>
              <div className="weather-sunrise-sunset">
                🌅 Sunrise: {new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString()}
                <br />
                🌇 Sunset: {new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString()}
              </div>
            </Col>
          </Row>
    
        </Card>
      )}


      <h2 className="forecast-title">Weather Forecast</h2>
      <Row gutter={16}>
        {forecast.map((item) => (
          <Col key={item.date} span={2.4}>
            <Card title={item.date} className="forecast-card">
              <div className="forecast-icon">{getWeatherEmoji(item.icon)}</div>
              <p className="forecast-temp">{item.temp}°C</p>
              <p className="forecast-description">{item.description}</p>
              <p className="forecast-wind">💨 {item.wind} km/h</p>
              <p className="forecast-humidity">💧 {item.humidity}%</p>
            </Card>
          </Col>
        ))}
      </Row>
     
      

      <div style={{ padding: '20px' }}>
        <DatePicker onChange={handleDateChange} />
        <Farmer selectedDate={selectedDate} city={city} currentWeather={currentWeather} forecast={forecast} />
        <EventPlanner selectedDate={selectedDate} city={city} currentWeather={currentWeather} forecast={forecast} />
        <Traveler selectedDate={selectedDate} city={city} currentWeather={currentWeather} forecast={forecast} />
      </div>
    </div>
  );
}

export default WeatherDashboard;




