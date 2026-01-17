/**
 * Teacher Dashboard Core Logic
 * Handles Analytics rendering and Student Search
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    initializeSearch();
    initializeInteractions();
});

/**
 * Initialize Chart.js Analytics
 */
function initializeCharts() {
    // Bar Chart Logic
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ["0-20", "21-40", "41-60", "61-80", "81-100"],
            datasets: [{
                label: "Students",
                data: [2, 5, 10, 8, 5],
                backgroundColor: '#4f46e5',
                borderRadius: 6,
                hoverBackgroundColor: '#4338ca'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            }
        }
    });

    // Pie Chart Logic
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'doughnut', // Modernized from 'pie' to 'doughnut'
        data: {
            labels: ["Pass", "Fail"],
            datasets: [{
                data: [22, 8],
                backgroundColor: ["#10b981", "#ef4444"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            },
            cutout: '70%'
        }
    });
}

/**
 * Handle Student Search Filtering
 */
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const table = document.getElementById('studentTable');
    const emptyState = document.getElementById('emptyState');
    
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        let visibleCount = 0;

        rows.forEach(row => {
            // Check Roll No (cell 0) or Name (cell 1)
            const text = row.innerText.toLowerCase();
            const isMatch = text.includes(term);
            
            row.style.display = isMatch ? '' : 'none';
            if (isMatch) visibleCount++;
        });

        // Toggle Empty State
        if (visibleCount === 0) {
            table.style.display = 'none';
            emptyState.classList.remove('hidden');
        } else {
            table.style.display = 'table';
            emptyState.classList.add('hidden');
        }
    });
}

/**
 * Subtle UI interactions for professional feel
 */
function initializeInteractions() {
    // Add active state to nav items on click
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Simulated "Extract" action
    const extractBtn = document.getElementById('extractBtn');
    extractBtn.addEventListener('click', () => {
        extractBtn.innerText = 'Generating...';
        extractBtn.disabled = true;
        
        setTimeout(() => {
            alert('Your report (PDF) has been prepared and downloaded.');
            extractBtn.innerText = 'Download Report';
            extractBtn.disabled = false;
        }, 1500);
    });
}
