// calendar.js
document.addEventListener('DOMContentLoaded', function() {
    const calendarSection = document.querySelector('[data-target="calendar"]');
    
    if (calendarSection) {
      calendarSection.addEventListener('click', function() {
        initializeCalendar();
        loadCalendarTasks(); // Load saved tasks when calendar is opened
      });
    }
  });
  
  let currentMonth, currentYear;
  let selectedDate = null;
  let selectedColor = "#D7EDEF"; // Default color
  let selectedIcon = "fa-calendar-alt";
  function initializeCalendar() {
    const calendarView = document.getElementById('calendar-view');
    const now = new Date();
    
    if (currentMonth === undefined) currentMonth = now.getMonth();
    if (currentYear === undefined) currentYear = now.getFullYear();
    
    renderCalendar(currentMonth, currentYear);
    
    // Color picker functionality
    document.querySelectorAll('.calendar-tasks .color-circle').forEach(circle => {
      circle.addEventListener('click', function() {
        document.querySelectorAll('.calendar-tasks .color-circle').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        selectedColor = this.getAttribute('data-color');
      });
    });

    // Icon picker functionality
    document.querySelectorAll('.icon-options i').forEach(icon => {
    icon.addEventListener('click', function () {
      document.querySelectorAll('.icon-options i').forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      selectedIcon = this.getAttribute('data-icon');
    });
  });
  
    
    // Add task button
    document.getElementById('add-calendar-task').addEventListener('click', addCalendarTask);
    
    // Handle Enter key in task input
    document.getElementById('calendar-task-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addCalendarTask();
      }
    });
  }
  
  function renderCalendar(month, year) {
    const calendarView = document.getElementById('calendar-view');
    const now = new Date();
    
    currentMonth = month;
    currentYear = year;
    
    calendarView.innerHTML = '';
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const header = document.createElement('div');
    header.className = 'calendar-header';
    
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.className = 'calendar-nav';
    prevBtn.addEventListener('click', () => {
      const newMonth = month === 0 ? 11 : month - 1;
      const newYear = month === 0 ? year - 1 : year;
      renderCalendar(newMonth, newYear);
    });
    
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.className = 'calendar-nav';
    nextBtn.addEventListener('click', () => {
      const newMonth = month === 11 ? 0 : month + 1;
      const newYear = month === 11 ? year + 1 : year;
      renderCalendar(newMonth, newYear);
    });
    
    const title = document.createElement('h2');
    title.textContent = `${monthNames[month]} ${year}`;
    
    header.appendChild(prevBtn);
    header.appendChild(title);
    header.appendChild(nextBtn);
    calendarView.appendChild(header);
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const daysHeader = document.createElement('div');
    daysHeader.className = 'calendar-days-header';
    
    dayNames.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.textContent = day;
      daysHeader.appendChild(dayElement);
    });
    
    calendarView.appendChild(daysHeader);
    
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day empty';
      grid.appendChild(emptyCell);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month + 1}-${day}`;
      const dayCell = document.createElement('div');
      dayCell.className = 'calendar-day';
      dayCell.textContent = day;
      dayCell.setAttribute('data-date', day);
      
      const now = new Date();
      if (day === now.getDate() && month === now.getMonth() && year === now.getFullYear()) {
        dayCell.classList.add('today');
      }
      
      const allTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    if (allTasks[dateStr] && allTasks[dateStr].length > 0) {
      const indicatorsContainer = document.createElement('div');
      indicatorsContainer.className = 'task-indicators-container';
      
      allTasks[dateStr].forEach(task => {
        const container = document.createElement('div');
        container.className = 'task-indicator-wrapper';

        const indicator = document.createElement('div');
        indicator.className = 'task-indicator-single';
        indicator.style.backgroundColor = task.color;

        const iconEl = document.createElement('i');
        iconEl.className = `fas ${task.icon}`;
        iconEl.style.color = '#000';
        iconEl.style.fontSize = '10px';
        iconEl.style.marginLeft = '4px';

        container.appendChild(iconEl);
        container.appendChild(indicator);
        indicatorsContainer.appendChild(container);
      });
      
      dayCell.appendChild(indicatorsContainer);
    }
      dayCell.addEventListener('click', () => {
        selectDate(day, month, year);
      });
      
      grid.appendChild(dayCell);
    }
    
    calendarView.appendChild(grid);
  }
  
  function selectDate(day, month, year) {
    selectedDate = `${year}-${month + 1}-${day}`;
    const dateObj = new Date(year, month, day);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('selected-date').textContent = dateObj.toLocaleDateString(undefined, options);
    
    // Load tasks for this date
    loadTasksForDate(selectedDate);
    updateDayIndicators(selectedDate);
  }
  
  function addCalendarTask() {
    if (!selectedDate) return;
    
    const taskInput = document.getElementById('calendar-task-input');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
      const taskId = Date.now();
      const task = {
        id: taskId,
        text: taskText,
        date: selectedDate,
        color: selectedColor,
        icon: selectedIcon,
        completed: false
      };
      
      // Save to localStorage
      saveCalendarTask(task);
      
      // Add to UI
      addTaskToUI(task);
      updateDayIndicators(selectedDate);
      // Clear input
      taskInput.value = '';
    }
  }
  
  function saveCalendarTask(task) {
    let tasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    if (!tasks[task.date]) {
      tasks[task.date] = [];
    }
    tasks[task.date].push(task);
    localStorage.setItem('calendarTasks', JSON.stringify(tasks));
  }
  
  function loadCalendarTasks() {
    const allTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};

  // Re-render current month with indicators
    renderCalendar(currentMonth, currentYear);
  }
  
  function loadTasksForDate(date) {
    const taskList = document.getElementById('calendar-task-list');
    taskList.innerHTML = '';
    
    const allTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    const dateTasks = allTasks[date] || [];
    
    dateTasks.forEach(task => {
      addTaskToUI(task);
    });
  }
  
  function addTaskToUI(task) {
    const taskList = document.getElementById('calendar-task-list');
    
    const taskElement = document.createElement('div');
    taskElement.className = 'calendar-task';
    taskElement.style.backgroundColor = task.color;
    taskElement.dataset.id = task.id;
    
    taskElement.innerHTML = `
      <span><i class="fas ${task.icon || 'fa-thumbtack'}"></i> ${task.text}</span>
      <div class="calendar-task-actions">
        <button class="delete-calendar-task">×</button>
      </div>
    `;
    
    taskElement.querySelector('.delete-calendar-task').addEventListener('click', function() {
      deleteCalendarTask(task.date, task.id);
      taskElement.remove();
    });
    
    taskList.appendChild(taskElement);
  }
  
  function updateDayIndicators(date) {
    // Clear existing indicators
    const dayCell = document.querySelector(`.calendar-day[data-date="${date}"]`);
    if (!dayCell) return;
    
    const existingIndicators = dayCell.querySelector('.task-indicators-container');
    if (existingIndicators) {
      existingIndicators.remove();
    }
  
    // Get tasks for this date
    const allTasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    const dateTasks = allTasks[date] || [];
  
    // Add new indicators if tasks exist
    if (dateTasks.length > 0) {
      const indicatorsContainer = document.createElement('div');
      indicatorsContainer.className = 'task-indicators-container';
      
      dateTasks.forEach(task => {
        const indicator = document.createElement('div');
        indicator.className = 'task-indicator-single';
        indicator.style.backgroundColor = task.color;
        const iconEl = document.createElement('i');
        iconEl.className = `fas ${task.icon}`;
        iconEl.style.color = '#fff';
        iconEl.style.fontSize = '10px';
        indicator.appendChild(iconEl);
        indicatorsContainer.appendChild(indicator);
      });
      
      dayCell.appendChild(indicatorsContainer);
    }
  }
  
  function deleteCalendarTask(date, taskId) {
    let tasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};
    if (tasks[date]) {
      tasks[date] = tasks[date].filter(task => task.id != taskId);
      localStorage.setItem('calendarTasks', JSON.stringify(tasks));
      updateDayIndicators(date);
    }
  }
  