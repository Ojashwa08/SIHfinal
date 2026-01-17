// Global state for habits
let habitData = {
    study: 2,
    screen: 4,
    reading: 1
};

// --- Theme Toggling Logic ---

/**
 * Toggles the dark/light theme for the application.
 */
function toggleTheme() {
    const body = document.body;
    const button = document.getElementById('themeToggleBtn');
    
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');

    // Update button text and icon
    if (body.classList.contains('dark-theme')) {
        button.innerHTML = '<span class="icon">☀️</span> Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        button.innerHTML = '<span class="icon">🌙</span> Dark Mode';
        localStorage.setItem('theme', 'light');
    }

    // Redraw canvas with new colors
    drawHabitCircle(habitData.study, habitData.screen, habitData.reading);
}

/**
 * Applies the saved theme preference on page load.
 */
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const button = document.getElementById('themeToggleBtn');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        button.innerHTML = '<span class="icon">☀️</span> Light Mode';
    } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        button.innerHTML = '<span class="icon">🌙</span> Dark Mode';
    }
}


// --- Habit Circle Drawing Logic (Pure JS Canvas) ---

/**
 * Draws the Habit Circle based on the current habit data.
 * @param {number} studyHours - Study time.
 * @param {number} screenTime - Screen time.
 * @param {number} readingTime - Reading time.
 */
function drawHabitCircle(studyHours, screenTime, readingTime) {
    const canvas = document.getElementById('habitCircle');
    const ctx = canvas.getContext('2d');
    const total = studyHours + screenTime + readingTime;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    let currentAngle = 0; // Start at the top (12 o'clock)

    // Helper to get CSS variable color
    const getCssVar = (varName) => getComputedStyle(document.body).getPropertyValue(varName).trim();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get dynamic colors from CSS variables
    const colors = {
        study: getCssVar('--color-primary'),
        screen: getCssVar('--color-accent'),
        reading: getCssVar('--color-secondary'),
        text: getCssVar('--text-primary')
    };

    const habits = [
        { label: 'Study', value: studyHours, color: colors.study, icon: '📖' },
        { label: 'Screen', value: screenTime, color: colors.screen, icon: '📺' },
        { label: 'Reading', value: readingTime, color: colors.reading, icon: '📚' },
    ];

    // Draw arcs
    habits.forEach(habit => {
        if (habit.value > 0) {
            const sliceAngle = (habit.value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = habit.color;
            ctx.fill();

            // Calculate midpoint of the slice for text/icon placement
            const midAngle = currentAngle + sliceAngle / 2;
            const textRadius = radius * 0.7; // Closer to the center for better look
            const textX = centerX + textRadius * Math.cos(midAngle);
            const textY = centerY + textRadius * Math.sin(midAngle);

            // Draw icon/text label
            ctx.fillStyle = '#ffffff'; // White text on colored background
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '16px Arial';
            ctx.fillText(habit.icon, textX, textY - 8);
            ctx.font = '12px Inter';
            ctx.fillText(habit.label, textX, textY + 12);
            
            currentAngle += sliceAngle;
        }
    });

    // Draw the center circle (donut effect)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = getCssVar('--bg-card');
    ctx.fill();
    
    // Draw total label in the center
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '20px Inter';
    ctx.fillText(`${total}h`, centerX, centerY - 10);
    ctx.font = '12px Inter';
    ctx.fillText('Total', centerX, centerY + 10);
}

// --- Demo Modal Logic (Fixing Demo Box Functionality) ---

const modal = document.getElementById('messageModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');

/**
 * Shows the custom modal with a specific title and message.
 * @param {string} title - The title for the modal.
 * @param {string} message - The message body.
 */
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
}

/**
 * Hides the custom modal.
 */
function closeModal() {
    modal.classList.add('hidden');
}

// --- Event Listeners and Initializers ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Apply saved theme
    applySavedTheme();

    // 2. Initial Habit Circle Draw
    drawHabitCircle(habitData.study, habitData.screen, habitData.reading);

    // 3. Theme Toggle Button Listener
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

    // 4. Habit Update Listener (Fixing Goals & Habit Tracker elements)
    document.getElementById('updateHabitsBtn').addEventListener('click', (e) => {
        e.preventDefault();
        
        const studyInput = document.getElementById('habitStudyHours');
        const screenInput = document.getElementById('screenTimeInput');
        const readingInput = document.getElementById('readingTimeInput');

        const newStudy = parseInt(studyInput.value) || 0;
        const newScreen = parseInt(screenInput.value) || 0;
        const newReading = parseInt(readingInput.value) || 0;

        if (newStudy < 0 || newScreen < 0 || newReading < 0) {
            showModal('Input Error', 'Time inputs cannot be negative.');
            return;
        }

        habitData.study = newStudy;
        habitData.screen = newScreen;
        habitData.reading = newReading;

        drawHabitCircle(habitData.study, habitData.screen, habitData.reading);
        showModal('Habit Updated!', `Habit Circle redrawn for a total of ${newStudy + newScreen + newReading} hours tracked.`);
    });

    // 5. Goal Form Submission
    document.getElementById('goalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('goalInput');
        const list = document.getElementById('goalList');

        if (input.value.trim() === '') {
            showModal('Goal Error', 'Please enter a goal before submitting.');
            return;
        }

        const newGoal = document.createElement('li');
        newGoal.className = 'goal-item-pending';
        newGoal.innerHTML = `${input.value} <span class="goal-progress-badge pending">0%</span>`;
        list.appendChild(newGoal);

        input.value = '';
        showModal('Goal Added', 'Your new goal has been successfully added to the tracker!');
    });
});
