

// When home tab is clicked
document.addEventListener('DOMContentLoaded', function () {
    // Render mini calendar (read-only, no click)
function renderMiniCalendar() {
  const container = document.getElementById('mini-calendar');
  if (!container) return;
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const calendarHTML = document.createElement('div');
  calendarHTML.className = 'calendar-grid';
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day empty';
    calendarHTML.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month + 1}-${day}`;
    const cell = document.createElement('div');
    cell.className = 'calendar-day mini';
    cell.textContent = day;

    const tasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    if (Array.isArray(tasks[dateStr]) && tasks[dateStr].length > 0) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'task-dots-container';
      
      // Create a dot for each task (or limit to a reasonable number)
      tasks[dateStr].slice(0, 3).forEach(task => { // Show up to 3 dots
        const dot = document.createElement('span');
        dot.className = 'task-dot';
        dot.style.backgroundColor = task.color || '#ccc';
        dotsContainer.appendChild(dot);
      });
      cell.appendChild(dotsContainer);
    }
    calendarHTML.appendChild(cell);
  }

  container.innerHTML = '';
  container.appendChild(calendarHTML);
}

// Load Daily Tasks to Home
function loadHomeDailyTasks() {
  const ul = document.getElementById('home-daily-tasks');
  if (!ul) {
            console.warn("Element with ID 'home-daily-tasks' not found");
            return;
  }
  const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
  ul.innerHTML = '';
  (tasks.daily || []).forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.style.textDecoration = 'line-through';
    ul.appendChild(li);
  });
}

// Load Recent Notes
function loadRecentNotes() {
  const notesContainer = document.querySelector('.recent-notes-container');
  if (!notesContainer) {
            console.warn("Element with class 'recent-notes-container' not found");
            return;
    }
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
  notesContainer.innerHTML = '';
  const recentNotes = savedNotes.slice(0, 3);
        
    recentNotes.forEach(note => {
        const div = document.createElement("div");
        div.setAttribute("class", "note");
        div.style.backgroundColor = note.color;
        div.innerHTML = `
            <h5>${note.date}</h5>
            <h2>${note.title}</h2>
            <hr>
            <div class="note-content">
                <div>${note.content}</div>
            </div>
            <div class="note-actions">
                <i class="fa-solid fa-pen-to-square edit-btn"></i>
                <i class="fa-solid fa-trash delete-btn"></i>
            </div>`;
        notesContainer.appendChild(div);
    });
    }

// Call all home initializers when Home is selected
document.querySelector('[data-target="home"]').addEventListener('click', function () {
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  
  document.getElementById('home').style.display = 'block';
  renderMiniCalendar();
  loadHomeDailyTasks();
  loadRecentNotes();
});

});
