document.getElementById('back-button').addEventListener('click', function() {
    window.location.href = 'index.html';
 });
 
 // real-time graphs
 const graphs = ['soilMoistureGraph', 'temperatureGraph', 'humidityGraph', 'weatherGraph'];
 graphs.forEach(graph => {
    const ctx = document.getElementById(graph).getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 100);
    ctx.stroke();
 });
 