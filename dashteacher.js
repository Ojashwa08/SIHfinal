/**
 * EduPulse Teacher Dashboard Logic
 * Features: LocalStorage persistence, Chart.js integration, Risk Analytics
 */

// Global State
let students = JSON.parse(localStorage.getItem('ep_students')) || [];
let scoreChart, passChart, scatterChart;

// DOM Elements
const tableBody = document.getElementById('tableBody');
const studentForm = document.getElementById('studentForm');
const modal = document.getElementById('studentModal');
const searchInput = document.getElementById('searchInput');

// --- Initialization ---
window.onload = () => {
    initCharts();
    updateUI();
};

// --- CRUD Operations ---

studentForm.onsubmit = (e) => {
    e.preventDefault();
    
    const editIndex = document.getElementById('editIndex').value;
    const newStudent = {
        rollNo: document.getElementById('rollNo').value,
        name: document.getElementById('fullName').value,
        attendance: parseInt(document.getElementById('attendance').value),
        score: parseInt(document.getElementById('score').value),
        acadTime: parseInt(document.getElementById('acadTime').value),
        idleTime: parseInt(document.getElementById('idleTime').value),
        timestamp: new Date().getTime()
    };

    if (editIndex === "") {
        students.push(newStudent);
    } else {
        students[editIndex] = newStudent;
    }

    saveAndRefresh();
    closeModal();
};

function deleteStudent(index) {
    if (confirm("Remove this student from the registry?")) {
        students.splice(index, 1);
        saveAndRefresh();
    }
}

function editStudent(index) {
    const s = students[index];
    document.getElementById('modalTitle').innerText = "Edit Student";
    document.getElementById('editIndex').value = index;
    document.getElementById('rollNo').value = s.rollNo;
    document.getElementById('fullName').value = s.name;
    document.getElementById('attendance').value = s.attendance;
    document.getElementById('score').value = s.score;
    document.getElementById('acadTime').value = s.acadTime;
    document.getElementById('idleTime').value = s.idleTime;
    
    modal.style.display = 'block';
}

// --- Analytics & Logic ---

function calculateRisk(s) {
    // Logic: Low score (<40) OR low attendance (<60) OR idle time > academic time
    let riskPoints = 0;
    if (s.score < 40) riskPoints += 2;
    if (s.attendance < 60) riskPoints += 2;
    if (s.idleTime > s.acadTime) riskPoints += 1;

    if (riskPoints >= 3) return { label: "High Risk", class: "bg-danger" };
    if (riskPoints >= 1) return { label: "Medium", class: "bg-warning" };
    return { label: "On Track", class: "bg-success" };
}

function classifyFocus(s) {
    const totalTime = s.acadTime + s.idleTime;
    if (totalTime === 0) return { label: "No Data", class: "bg-secondary" };
    
    const ratio = s.acadTime / totalTime;
    if (ratio > 0.75) return { label: "Focused", class: "bg-success" };
    if (ratio > 0.40) return { label: "Mixed", class: "bg-primary" };
    return { label: "Distracted", class: "bg-danger" };
}

// --- UI Rendering ---

function updateUI(filteredStudents = students) {
    renderTable(filteredStudents);
    updateStats();
    updateCharts();
}

function renderTable(data) {
    tableBody.innerHTML = "";
    document.getElementById('noData').classList.toggle('hidden', data.length > 0);

    data.forEach((s, index) => {
        const risk = calculateRisk(s);
        const focus = classifyFocus(s);
        
        const row = `
            <tr>
                <td>#${s.rollNo}</td>
                <td><strong>${s.name}</strong></td>
                <td>${s.score}%</td>
                <td>${s.attendance}%</td>
                <td><span class="badge ${focus.class}">${focus.label}</span></td>
                <td><span class="badge ${risk.class}">${risk.label}</span></td>
                <td>
                    <button class="btn btn-secondary" style="padding: 4px 8px;" onclick="editStudent(${index})">Edit</button>
                    <button class="btn btn-secondary text-danger" style="padding: 4px 8px; border-color: #fca5a5;" onclick="deleteStudent(${index})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function updateStats() {
    const total = students.length;
    const avg = total > 0 ? Math.round(students.reduce((a, b) => a + b.score, 0) / total) : 0;
    const passCount = students.filter(s => s.score >= 40).length;
    const passRate = total > 0 ? Math.round((passCount / total) * 100) : 0;
    const riskCount = students.filter(s => calculateRisk(s).label === "High Risk").length;

    document.getElementById('statTotal').innerText = total;
    document.getElementById('statAvg').innerText = `${avg}%`;
    document.getElementById('avgBar').style.width = `${avg}%`;
    document.getElementById('statPassRate').innerText = `${passRate}%`;
    document.getElementById('statRiskCount').innerText = riskCount;
}

function saveAndRefresh() {
    localStorage.setItem('ep_students', JSON.stringify(students));
    updateUI();
}

// --- Charts ---

function initCharts() {
    const ctxScore = document.getElementById('scoreChart').getContext('2d');
    scoreChart = new Chart(ctxScore, {
        type: 'bar',
        data: { labels: ['0-40', '41-60', '61-80', '81-100'], datasets: [{ label: 'Students', data: [0,0,0,0], backgroundColor: '#6366f1' }] },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const ctxPass = document.getElementById('passChart').getContext('2d');
    passChart = new Chart(ctxPass, {
        type: 'pie',
        data: { labels: ['Pass', 'Fail'], datasets: [{ data: [0, 0], backgroundColor: ['#10b981', '#ef4444'] }] },
        options: { responsive: true, maintainAspectRatio: false }
    });

    const ctxScatter = document.getElementById('scatterChart').getContext('2d');
    scatterChart = new Chart(ctxScatter, {
        type: 'scatter',
        data: { datasets: [{ label: 'Performance Correlation', data: [], backgroundColor: '#6366f1' }] },
        options: {
            scales: { x: { title: { display: true, text: 'Attendance %' } }, y: { title: { display: true, text: 'Score %' } } },
            responsive: true, maintainAspectRatio: false
        }
    });
}

function updateCharts() {
    if (!scoreChart) return;

    // Update Score Distribution
    const dist = [
        students.filter(s => s.score < 40).length,
        students.filter(s => s.score >= 40 && s.score < 60).length,
        students.filter(s => s.score >= 60 && s.score < 80).length,
        students.filter(s => s.score >= 80).length
    ];
    scoreChart.data.datasets[0].data = dist;
    scoreChart.update();

    // Update Pass/Fail
    const passed = students.filter(s => s.score >= 40).length;
    passChart.data.datasets[0].data = [passed, students.length - passed];
    passChart.update();

    // Update Scatter
    scatterChart.data.datasets[0].data = students.map(s => ({ x: s.attendance, y: s.score }));
    scatterChart.update();
}

// --- Utilities ---

function exportCSV() {
    if (students.length === 0) return alert("No data to export.");
    
    let csv = "Roll No,Name,Score,Attendance,Acad Mins,Idle Mins,Risk\n";
    students.forEach(s => {
        csv += `${s.rollNo},${s.name},${s.score},${s.attendance},${s.acadTime},${s.idleTime},${calculateRisk(s).label}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduPulse_Report_${new Date().toLocaleDateString()}.csv`;
    a.click();
}

// Search Logic
searchInput.oninput = (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(val) || s.rollNo.toString().includes(val)
    );
    renderTable(filtered);
};

// --- Modal Controls ---
document.getElementById('openModalBtn').onclick = () => {
    document.getElementById('modalTitle').innerText = "Add New Student";
    document.getElementById('studentForm').reset();
    document.getElementById('editIndex').value = "";
    modal.style.display = 'block';
};

function closeModal() { modal.style.display = 'none'; }
document.querySelector('.close-modal').onclick = closeModal;
window.onclick = (e) => { if (e.target == modal) closeModal(); };

document.getElementById('exportBtn').onclick = exportCSV;

document.getElementById('clearAllBtn').onclick = () => {
    if (confirm("DANGER: This will delete all students from your browser database. Continue?")) {
        students = [];
        saveAndRefresh();
    }
};
