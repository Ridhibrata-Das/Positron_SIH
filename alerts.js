document.addEventListener('DOMContentLoaded', () => {
    const soilMoistureUrl = `https://api.thingspeak.com/channels/2647422/feeds.json?api_key=1IND2YTTTRS3WCNY&results=1`; // ThingSpeak API for soil moisture
    const openMeteoUrl = 'https://api.open-meteo.com/v1/forecast?latitude=22.5626&longitude=88.363&current_weather=true'; // Replace with actual lat/lon

    // Fetch soil moisture data from ThingSpeak
    async function fetchSoilMoisture() {
        try {
            const response = await fetch(soilMoistureUrl);
            const data = await response.json();
            const latestSoilMoisture = parseFloat(data.feeds[0].field1); // Assuming field1 is soil moisture

            // Check moisture level and update alert
            updateSoilMoistureAlert(latestSoilMoisture);
        } catch (error) {
            console.error('Error fetching soil moisture data:', error);
        }
    }

    // Function to update soil moisture alert based on value
    function updateSoilMoistureAlert(moistureValue) {
        const alertMessageElement = document.getElementById('alert-message');
        const alertContainer = document.getElementById('soil-moisture-alert');

        if (moistureValue > 85) {
            alertMessageElement.textContent = 'Too much water! Please reduce watering.';
            alertContainer.style.backgroundColor = 'red';
        } else if (moistureValue >= 55 && moistureValue <= 84.9) {
            alertMessageElement.textContent = 'Moderate moisture. No action needed.';
            alertContainer.style.backgroundColor = 'yellow';
        } else if (moistureValue >= 35 && moistureValue <= 54.9) {
            alertMessageElement.textContent = 'Optimal moisture level.';
            alertContainer.style.backgroundColor = 'green';
        } else if (moistureValue >= 20 && moistureValue <= 34.9) {
            alertMessageElement.textContent = 'Moisture level low. Consider watering soon.';
            alertContainer.style.backgroundColor = 'yellow';
        } else if (moistureValue < 20) {
            alertMessageElement.textContent = 'Very low moisture! Please water the plants.';
            alertContainer.style.backgroundColor = 'red';
        }
    }

    // Fetch temperature, humidity, and precipitation data from Open-Meteo (use existing function here)
    async function fetchWeatherData() {
        try {
            const response = await fetch(openMeteoUrl);
            const weatherData = await response.json();
            const currentWeather = weatherData.current_weather;

            const temperature = currentWeather.temperature;
            document.getElementById('temperature-value').textContent = `${temperature}°C`;
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    // Function to continuously update data
    function updateData() {
        fetchSoilMoisture();
        fetchWeatherData();
    }

    // Set interval to update data every 10 seconds
    setInterval(updateData, 10000);
});
