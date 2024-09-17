document.addEventListener('DOMContentLoaded', () => {
  const channelID = '2647422'; 
  const apiKey = '1IND2YTTTRS3WCNY'; 
  const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=100`;

  // Fetch Data
  function fetchData() {
      d3.json(url).then(data => {
          const feeds = data.feeds;
          const parsedData = feeds.map(d => ({
              date: new Date(d.created_at),
              value: +d.field1 
          }));

          drawChart(parsedData);
      });
  }

  // Draw Chart
  function drawChart(data) {
      const margin = { top: 20, right: 30, bottom: 50, left: 60 };
      const width = 550 - margin.left - margin.right;
      const height = 275 - margin.top - margin.bottom;

      const x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width]);
      const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).nice().range([height, 0]);

      const svg = d3.select('#realTimeGraph').append('svg')
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
          .text('Soil Moisture (%)');

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
              tooltip.html(`Soil Moisture: ${d.value} %<br>Date: ${d.date.toLocaleDateString()}`)
                  .style('left', (event.pageX + 5) + 'px')
                  .style('top', (event.pageY - 28) + 'px');
          })
          .on('mouseout', () => {
              tooltip.transition().duration(500).style('opacity', 0);
          });
  }

  fetchData();
});

