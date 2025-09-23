document.addEventListener('DOMContentLoaded', () => {
  const studentTab = document.getElementById('studentTab');
  const teacherTab = document.getElementById('teacherTab');
  const studentForm = document.getElementById('studentForm');
  const teacherForm = document.getElementById('teacherForm');

  const sEmail = document.getElementById('studentEmail');
  const sPass  = document.getElementById('studentPassword');
  const tEmail = document.getElementById('teacherEmail');
  const tPass  = document.getElementById('teacherPassword');

  const sMsg = studentForm.querySelector('.message');
  const tMsg = teacherForm.querySelector('.message');

  function showStudent() {
    studentTab.classList.add('active');
    teacherTab.classList.remove('active');
    studentTab.setAttribute('aria-selected', 'true');
    teacherTab.setAttribute('aria-selected', 'false');

    studentForm.classList.add('active');
    studentForm.classList.remove('hidden');

    teacherForm.classList.add('hidden');
    teacherForm.classList.remove('active');

    sEmail.focus();
    sMsg.textContent = '';
    tMsg.textContent = '';
  }

  function showTeacher() {
    teacherTab.classList.add('active');
    studentTab.classList.remove('active');
    teacherTab.setAttribute('aria-selected', 'true');
    studentTab.setAttribute('aria-selected', 'false');

    teacherForm.classList.add('active');
    teacherForm.classList.remove('hidden');

    studentForm.classList.add('hidden');
    studentForm.classList.remove('active');

    tEmail.focus();
    sMsg.textContent = '';
    tMsg.textContent = '';
  }

  studentTab.addEventListener("click", showStudent);
  teacherTab.addEventListener("click", showTeacher);

  studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = sEmail.value.trim();
    const pass = sPass.value.trim();

    if (email === 'student@demo.com' && pass === 'demo123') {
      sMsg.style.color = '#065f46';
      sMsg.textContent = '✅ Student login successful (demo).';
      window.location.href = "dashstudent.html";  
    } else {
      sMsg.style.color = '#b91c1c';
      sMsg.textContent = '❌ Invalid student credentials.';
    }
  });

  teacherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = tEmail.value.trim();
    const pass = tPass.value.trim();

    if (email === 'teacher@demo.com' && pass === 'demo123') {
      tMsg.style.color = '#065f46';
      tMsg.textContent = '✅ Teacher login successful (demo).';
      window.location.href = "dashteacher.html";  
    } else {
      tMsg.style.color = '#b91c1c';
      tMsg.textContent = '❌ Invalid teacher credentials.';
    }
  });

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(reg => console.log("✅ Service Worker registered:", reg))
      .catch(err => console.error("❌ Service Worker failed:", err));
  });
}


});

