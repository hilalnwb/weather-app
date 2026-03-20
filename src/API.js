export const geoApiOptions = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': process.env.REACT_APP_GEO_API_KEY, 
        'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
    }
};

export const GEO_API_URL = process.env.REACT_APP_GEO_API_URL;

export const WEATHER_API_URL = process.env.REACT_APP_WEATHER_API_URL;

export const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;