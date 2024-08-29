// src/api.js
import axios from "axios";

const API_KEY = '41f3f75e227138c0e7e2a24c31ed5be5';  
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (location) => {
    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: location,
                units: 'metric',
                appid: API_KEY,
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};
