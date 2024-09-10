
function fetchShowersData() {
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=22.5626&longitude=88.363&hourly=showers&past_days=7';

    d3.json(weatherUrl).then(data => {
        const hourlyData = data.hourly.time.map((time, index) => ({
            date: new Date(time),
            showers: data.hourly.showers[index]
        }));

        drawShowersChart(hourlyData); 
    }).catch(error => {
        console.error('Error fetching weather data:', error);
    });
}

function drawShowersChart(data) {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 550 - margin.left - margin.right;
    const height = 275 - margin.top - margin.bottom;

    const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width]);
    const yShowers = d3.scaleLinear().domain([d3.min(data, d => d.showers), d3.max(data, d => d.showers)]).nice().range([height, 0]);

    const svgShowers = d3.select('#showers-chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svgShowers.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svgShowers.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yShowers))
      .append('text')
      .attr('fill', 'blue')
      .attr('x', -30)
      .attr('y', -10)
      .text('Showers (mm)');

    svgShowers.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
        .x(d => x(d.date))
        .y(d => yShowers(d.showers))
      );
}

fetchShowersData();
