const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const menuIcon = document.querySelector('.menu-icon');

// adjust layout
menuIcon.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    mainContent.classList.toggle('collapsed');


    if (menuIcon.classList.contains('close')) {
        menuIcon.classList.remove('close');
        menuIcon.innerHTML = '&#9776;'; // Hamburger icon
    } else {
        menuIcon.classList.add('close');
        menuIcon.innerHTML = '&times;'; // Cross icon
    }
});

// Selecting DOM elements
const realTimeGraph = document.getElementById('realTimeGraph').getContext('2d');

// update the graph
async function fetchData() {
    try {
        const response = await fetch('YOUR_API_ENDPOINT_HERE'); 
        const data = await response.json();
        updateGraph(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// new data
function updateGraph(data) {
    const chart = new Chart(realTimeGraph, {
        type: 'line', 
        data: {
            labels: data.labels, 
            datasets: [{
                label: 'Real-Time Data',
                data: data.values, 
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// update the graph every 5 seconds
setInterval(fetchData, 5000); 
