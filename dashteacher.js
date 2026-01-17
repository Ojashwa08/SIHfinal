// SeekhExplore Teacher Dashboard Logic
// Strictly adhering to "Render Once, Update Only" architecture

document.addEventListener('DOMContentLoaded', () => {
    // Initial Run of all update functions
    updateOverview();
    updateScreenTime();
    updateVisualAnalytics();
    
    // Setup Search Listener
    const searchInput = document.getElementById('student-search');
    if (searchInput) {
        searchInput.addEventListener('keyup', filterStudents);
    }
});

/* -----------------------------------------------------------
   1. OVERVIEW SECTION UPDATES
   Updates the 4 main stat cards with fetched data.
----------------------------------------------------------- */
function updateOverview() {
    // Simulated data fetching
    const data = {
        totalStudents: 108,
        avgScore: 78,
        highestScore: 98,
        passRate: 92
    };

    // DOM Updates
    document.getElementById('total-students').textContent = data.totalStudents;
    document.getElementById('avg-score').textContent = data.avgScore + '%';
    document.getElementById('highest-score').textContent = data.highestScore + '%';
    document.getElementById('pass-rate').textContent = data.passRate + '%';
}

/* -----------------------------------------------------------
   2. SCREEN TIME ANALYTICS
   Updates the text and progress bars for time metrics.
----------------------------------------------------------- */
function updateScreenTime() {
    // Simulated data
    const screenData = {
        academicHours: 4,
        academicMins: 15,
        idleHours: 1,
        idleMins: 30,
        focusPercentage: 75 // Used for progress bar width
    };

    // Text Updates
    document.getElementById('academic-time').textContent = 
        `${screenData.academicHours}h ${screenData.academicMins}m`;
    
    document.getElementById('idle-time').textContent = 
        `${screenData.idleHours}h ${screenData.idleMins}m`;

    // CSS Visual Update (Progress Bar)
    const progressBar = document.getElementById('academic-progress');
    if (progressBar) {
        progressBar.style.width = `${screenData.focusPercentage}%`;
    }
}

/* -----------------------------------------------------------
   3. VISUAL ANALYTICS (CSS ONLY)
   Updates Bar Chart Heights and Pie Chart Gradient.
   No Canvas, No SVG manipulation, just CSS properties.
----------------------------------------------------------- */
function updateVisualAnalytics() {
    // --- Bar Chart Data (Weekly Engagement) ---
    // Values represent percentage height (0-100)
    const weeklyData = {
        mon: 45,
        tue: 60,
        wed: 85,
        thu: 70,
        fri: 55
    };

    // Update CSS Variable --height for each bar
    const days = ['mon', 'tue', 'wed', 'thu', 'fri'];
    days.forEach(day => {
        const bar = document.getElementById(`bar-${day}`);
        if (bar) {
            // Adding '%' string for CSS value
            bar.style.setProperty('--height', `${weeklyData[day]}%`);
        }
    });

    // --- Pie Chart Data (Topic Mastery) ---
    // Breakdown: Advanced (Green), Proficient (Blue), Basic (Orange)
    // We construct a conic-gradient string.
    const mastery = {
        advanced: 40,   // 0% to 40%
        proficient: 35, // 40% to 75% (40+35)
        basic: 25       // 75% to 100%
    };

    const pie = document.getElementById('mastery-pie');
    if (pie) {
        // Calculate stops
        const stop1 = mastery.advanced;
        const stop2 = stop1 + mastery.proficient;
        
        // Apply Conic Gradient
        // color-1: var(--success) #10b981
        // color-2: var(--info) #3b82f6
        // color-3: var(--warning) #f59e0b
        pie.style.background = `conic-gradient(
            #10b981 0% ${stop1}%, 
            #3b82f6 ${stop1}% ${stop2}%, 
            #f59e0b ${stop2}% 100%
        )`;
    }
}

/* -----------------------------------------------------------
   4. STUDENT TABLE FILTERING
   Hides/Shows existing HTML rows based on input.
   Does NOT create or delete DOM nodes.
----------------------------------------------------------- */
function filterStudents() {
    const input = document.getElementById('student-search');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('student-table');
    const tr = table.getElementsByTagName('tr');

    // Loop through all table rows, and hide those who don't match the search query
    // Start at i=1 to skip the header row
    for (let i = 1; i < tr.length; i++) {
        // Column 0 is Roll No, Column 1 is Name
        const tdRoll = tr[i].getElementsByTagName('td')[0];
        const tdName = tr[i].getElementsByTagName('td')[1];
        
        if (tdRoll && tdName) {
            const txtValueRoll = tdRoll.textContent || tdRoll.innerText;
            const txtValueName = tdName.textContent || tdName.innerText;
            
            if (txtValueRoll.toUpperCase().indexOf(filter) > -1 || 
                txtValueName.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // Show
            } else {
                tr[i].style.display = "none"; // Hide
            }
        }       
    }
}
