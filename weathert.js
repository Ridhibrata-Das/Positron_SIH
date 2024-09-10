function fetchWeatherData() {
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=22.5626&longitude=88.363&hourly=temperature_2m&past_days=7';
    
    d3.json(weatherUrl).then(data => {
        const hourlyData = data.hourly.temperature_2m.map((value, index) => ({
            date: new Date(data.hourly.time[index]),
            value: value
        }));

        drawWeatherChart(hourlyData); 
    }).catch(error => {
        console.error('Error fetching weather data:', error);
    });
}

function drawWeatherChart(data) {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 550 - margin.left - margin.right;
    const height = 275 - margin.top - margin.bottom;

    const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width]);
    const y = d3.scaleLinear().domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]).nice().range([height, 0]);

    const svg = d3.select('#weather-chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
      );
}

fetchWeatherData();
