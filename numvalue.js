document.addEventListener('DOMContentLoaded', () => {
    const soilMoistureUrl = `https://api.thingspeak.com/channels/2647422/feeds.json?api_key=1IND2YTTTRS3WCNY&results=1`; // ThingSpeak API for soil moisture
    
    // Open-Meteo APIs for temperature and precipitation (showers)
    const temperatureUrl = 'https://api.open-meteo.com/v1/forecast?latitude=22.5626&longitude=88.363&hourly=temperature_2m&past_days=7';
    const precipitationUrl = 'https://api.open-meteo.com/v1/forecast?latitude=22.5626&longitude=88.363&hourly=showers&past_days=7';

    // Fetch soil moisture data from ThingSpeak
    async function fetchSoilMoisture() {
        try {
            const response = await fetch(soilMoistureUrl);
            const data = await response.json();
            const latestSoilMoisture = data.feeds[0].field1; // Assuming field1 is soil moisture

            // Update the HTML element for soil moisture
            document.getElementById('soil-moisture-value').textContent = `${latestSoilMoisture}%`; // Add % if required
        } catch (error) {
            console.error('Error fetching soil moisture data:', error);
        }
    }

    // Fetch temperature data from Open-Meteo
    async function fetchTemperature() {
        try {
            const response = await fetch(temperatureUrl);
            const temperatureData = await response.json();
            const temperatureArray = temperatureData.hourly.temperature_2m;
            const latestTemperature = temperatureArray[temperatureArray.length - 1]; // Latest temperature value

            // Update the HTML element for temperature
            document.getElementById('temperature-value').textContent = `${latestTemperature}°C`;
        } catch (error) {
            console.error('Error fetching temperature data:', error);
        }
    }

    // Fetch precipitation (showers) data from Open-Meteo
    async function fetchPrecipitation() {
        try {
            const response = await fetch(precipitationUrl);
            const precipitationData = await response.json();
            const precipitationArray = precipitationData.hourly.showers;
            const latestPrecipitation = precipitationArray[precipitationArray.length - 1]; // Latest precipitation value

            // Update the HTML element for precipitation (weather)
            document.getElementById('weather-value').textContent = `${latestPrecipitation} mm`; // Display precipitation in mm
        } catch (error) {
            console.error('Error fetching precipitation data:', error);
        }
    }

    // Function to continuously update data every few seconds
    function updateData() {
        fetchSoilMoisture();
        fetchTemperature();
        fetchPrecipitation();
    }

    // Set interval to update data every 5 seconds (adjust as needed)
    setInterval(updateData, 5000); // Update every 5 seconds
});
