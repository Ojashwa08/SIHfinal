document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Theme toggle button
  const toggleBtn = document.querySelector('.theme-toggle');
  if(toggleBtn){
    toggleBtn.addEventListener('click', () => {
      if(body.classList.contains('light-mode')){
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
      } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
      }
    });
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme){
    body.classList.add(savedTheme);
  } else {
    body.classList.add('dark-mode'); // default
  }
});

