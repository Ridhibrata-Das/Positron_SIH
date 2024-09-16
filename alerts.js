document.addEventListener('DOMContentLoaded', () => {
    const openMeteoBaseUrl = 'https://api.open-meteo.com/v1/forecast';
    const openCageApiKey = 'abe9841119844be5a3932e8bac2329f8'; // Get your API key from OpenCage
    const soilMoistureUrl = `https://api.thingspeak.com/channels/2647422/feeds.json?api_key=1IND2YTTTRS3WCNY&results=1`; // ThingSpeak API for soil moisture

    // Function to fetch geolocation data based on user input
    async function fetchCoordinates(location) {
        try {
            const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${openCageApiKey}&limit=1`;
            const response = await fetch(geocodeUrl);
            const data = await response.json();

            if (data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                return { lat: lat.toFixed(3), lng: lng.toFixed(3) }; // Limit to 3 decimal places
            } else {
                throw new Error("Location not found");
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            alert('Unable to fetch coordinates. Please try again.');
        }
    }

    // Function to fetch weather data from Open-Meteo using latitude and longitude
    async function fetchWeatherData(lat, lng) {
        try {
            const weatherUrl = `${openMeteoBaseUrl}?latitude=${lat}&longitude=${lng}&current_weather=true`;
            const response = await fetch(weatherUrl);
            const weatherData = await response.json();
            const currentWeather = weatherData.current_weather;

            // Display weather data in your chosen HTML elements
            const temperature = currentWeather.temperature;
            const precipitation = currentWeather.precipitation;

            document.getElementById('temperature-value').textContent = `${temperature}°C`;
            document.getElementById('weather-value').textContent = `${precipitation} mm`;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Unable to fetch weather data. Please try again.');
        }
    }

    // Event listener for location submission
    document.getElementById('submit-location').addEventListener('click', async () => {
        const location = document.getElementById('location-input').value;

        if (location) {
            const { lat, lng } = await fetchCoordinates(location); // Get latitude and longitude for the input location
            fetchWeatherData(lat, lng); // Fetch weather data for that location
        } else {
            alert('Please enter a valid location.');
        }
    });

    // Function to fetch soil moisture data from ThingSpeak
    async function fetchSoilMoisture() {
        try {
            const response = await fetch(soilMoistureUrl);
            const data = await response.json();
            const latestSoilMoisture = parseFloat(data.feeds[0].field1);
            updateSoilMoistureAlert(latestSoilMoisture);
        } catch (error) {
            console.error('Error fetching soil moisture data:', error);
        }
    }

    // Function to update soil moisture alert
    function updateSoilMoistureAlert(moistureValue) {
        const alertMessageElement = document.getElementById('alert-message');
        const alertContainer = document.getElementById('soil-moisture-alert');

        if (moistureValue > 85) {
            alertMessageElement.textContent = 'Too much water! Please reduce watering.';
            alertContainer.style.backgroundColor = 'red';
        } else if (moistureValue >= 55 && moistureValue <= 84.9) {
            alertMessageElement.textContent = 'Moderate moisture. No action needed.';
            alertContainer.style.backgroundColor = 'yellow';
        } else if (moistureValue >= 30 && moistureValue <= 54.9) {
            alertMessageElement.textContent = 'Optimal moisture level.';
            alertContainer.style.backgroundColor = 'green';
        } else if (moistureValue >= 20 && moistureValue <= 29.9) {
            alertMessageElement.textContent = 'Moisture level low. Consider watering soon.';
            alertContainer.style.backgroundColor = 'yellow';
        } else if (moistureValue < 20) {
            alertMessageElement.textContent = 'Very low moisture! Please water the plants.';
            alertContainer.style.backgroundColor = 'red';
        }
    }

    // Function to continuously update soil moisture and weather data every 10 seconds
    function updateData() {
        fetchSoilMoisture();
    }

    // Set interval to update soil moisture every 10 seconds
    setInterval(updateData, 10000);
});
