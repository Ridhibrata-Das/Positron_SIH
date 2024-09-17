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
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  const width = 550 - margin.left - margin.right;
  const height = 275 - margin.top - margin.bottom;

  const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width]);
  const y = d3.scaleLinear().domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]).nice().range([height, 0]);

  const svg = d3.select('#weather-chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // X Axis
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(6))
    .append('text')
    .attr('fill', '#000')
    .attr('x', width / 2)
    .attr('y', margin.bottom - 10)
    .attr('text-anchor', 'middle')
    .text('Date');

  // Y Axis
  svg.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y).ticks(6))
    .append('text')
    .attr('fill', '#000')
    .attr('x', -margin.left)
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Temperature (°C)');
    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', 'black')
      .attr('x', -50)  // Adjust this value to move the label further left
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px');
  // Line Path
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value))
    );

  // Tooltip
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  svg.append('g')
    .selectAll('dot')
    .data(data)
    .enter().append('circle')
    .attr('r', 3)
    .attr('fill', 'steelblue')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.value))
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`Temperature: ${d.value} °C<br>Date: ${d.date.toLocaleDateString()}`)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });
}

fetchWeatherData();
