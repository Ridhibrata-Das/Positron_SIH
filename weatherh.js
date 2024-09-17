function fetchWeatherData() {
  const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=22.5626&longitude=88.363&hourly=relative_humidity_2m&past_days=7';

  d3.json(weatherUrl).then(data => {
      const hourlyData = data.hourly.time.map((time, index) => ({
          date: new Date(time),
          humidity: data.hourly.relative_humidity_2m[index]
      }));

      drawHumidityChart(hourlyData); // Draw humidity chart
  }).catch(error => {
      console.error('Error fetching weather data:', error);
  });
}

function drawHumidityChart(data) {
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  const width = 550 - margin.left - margin.right;
  const height = 275 - margin.top - margin.bottom;

  const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width]);
  const yHumidity = d3.scaleLinear().domain([0, d3.max(data, d => d.humidity)]).nice().range([height, 0]);

  const svgHumidity = d3.select('#humidity-chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // X Axis
  svgHumidity.append('g')
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
  svgHumidity.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yHumidity).ticks(6))
    .append('text')
    .attr('fill', '#000')
    .attr('x', -margin.left)
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Humidity (%)');

  // Line Path
  svgHumidity.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', 1.5)
    .attr('d', d3.line()
      .x(d => x(d.date))
      .y(d => yHumidity(d.humidity))
    );

  // Tooltip
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  svgHumidity.append('g')
    .selectAll('dot')
    .data(data)
    .enter().append('circle')
    .attr('r', 3)
    .attr('fill', 'green')
    .attr('cx', d => x(d.date))
    .attr('cy', d => yHumidity(d.humidity))
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`Humidity: ${d.humidity}%<br>Date: ${d.date.toLocaleDateString()}`)
        .style('left', (event.pageX + 5) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });
}

fetchWeatherData();
