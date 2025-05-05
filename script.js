document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');
    const menuItems = document.querySelectorAll('.menu li');
    const contentSections = document.querySelectorAll('.content-section');
  
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
    });
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        contentSections.forEach(section => {
          section.style.display = 'none';
        });
        
        
        document.getElementById(targetId).style.display = 'block';
      });
    });

    var overlay=document.querySelector(".popup-overlay ")
    var popup=document.querySelector(".notes-inputbox")
    var addbtn=document.getElementById("add-btn")

    addbtn.addEventListener("click",function(){
      overlay.style.display="block"
      popup.style.display="block"
    })

    var cancelbtn=document.getElementById("cancel-note")
    cancelbtn.addEventListener("click",function(event){
      event.preventDefault()
      overlay.style.display="none"
      popup.style.display="none"
    })

    var selectedColor = "#D7EDEF"; // default color if none selected

    var colorCircles = document.querySelectorAll(".color-circle");

    colorCircles.forEach(circle => {
      circle.addEventListener("click", function() {
      
        colorCircles.forEach(c => c.classList.remove("selected"));
        
        this.classList.add("selected");
       
        selectedColor = this.getAttribute("data-color");
      });
    });

    var container=document.querySelector(".notes-container")
    var addnote=document.getElementById("add-note")
    var notetitle=document.getElementById("note-title")
    var description=document.getElementById("note-input")
    addnote.addEventListener("click",function(event){
      event.preventDefault()
      var today = new Date();
      var date = today.toLocaleDateString();
      var div=document.createElement("div")
      div.setAttribute("class","note")
      div.style.backgroundColor = selectedColor;
      div.innerHTML = `
          <h5>${date}</h5>
          <h2>${notetitle.value}</h2>
          <hr>
          <div class="note-content">
            <div>${description.value}</div>
          </div>
          <div class="note-actions">
            <i class="fa-solid fa-pen-to-square edit-btn"></i>
            <i class="fa-solid fa-trash delete-btn"></i>
          </div>`;
  
      container.insertBefore(div,container.firstChild);
      overlay.style.display="none"
      popup.style.display="none"
      notetitle.value=''
      description.value=''
      selectedColor = "#D7EDEF"; // Reset to default after adding
      colorCircles.forEach(c => c.classList.remove("selected"));
    })

  container.addEventListener('click', function(e) {

  if (e.target.classList.contains('fa-trash')) {
    e.target.closest('.note').remove();
  }
  
  // Edit functionality
  if (e.target.classList.contains('fa-pen-to-square')) {
    const note = e.target.closest('.note');
    const title = note.querySelector('h2').textContent;
    const content = note.querySelector('.note-content div').textContent;
    const color = note.style.backgroundColor;
    
    // Fill the popup form with existing values
    notetitle.value = title;
    description.value = content;
    
    colorCircles.forEach(circle => {
      if (circle.getAttribute('data-color') === color) {
        circle.classList.add('selected');
        selectedColor = color;
      } else {
        circle.classList.remove('selected');
      }
    });
  
    overlay.style.display = "block";
    popup.style.display = "block";
    
    addnote.onclick = function(event) {
      event.preventDefault();
      note.remove();
    };
  }
  });
  document.getElementById('tasks').style.display = 'block';
  // Inside your DOMContentLoaded event:
document.querySelectorAll('.add-task').forEach(button => {
  button.addEventListener('click', function() {
    const listType = this.getAttribute('data-list');
    const input = document.getElementById(`${listType}-input`);
    const taskText = input.value.trim();
    
    if (taskText) {
      addTask(listType, taskText);
      input.value = '';
      input.focus();
    }
  });
});

document.querySelectorAll('.task-input input').forEach(input => {
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const listType = this.id.split('-')[0];
      const taskText = this.value.trim();
      
      if (taskText) {
        addTask(listType, taskText);
        this.value = '';
        
      }
    }
  });
});

// Function to add a new task
function addTask(listType, taskText) {
  const list = document.getElementById(`${listType}-list`);
  const taskId = Date.now();
  
  const taskItem = document.createElement('li');
  taskItem.className = 'task-item';
  taskItem.dataset.id = taskId;
  
  taskItem.innerHTML = `
    <input type="checkbox" id="task-${taskId}">
    <label for="task-${taskId}">${taskText}</label>
    <button class="delete-task">×</button>
  `;
  
  list.appendChild(taskItem);

  taskItem.querySelector('input').addEventListener('change', function() {
    taskItem.classList.toggle('completed', this.checked);
    saveTasks();
  });
  
  taskItem.querySelector('.delete-task').addEventListener('click', function() {
    taskItem.remove();
    saveTasks();
  });
  
  saveTasks();
}
function saveTasks() {
  const tasks = {
    daily: [],
    weekly: [],
    monthly: []
  };
  
  document.querySelectorAll('.task-item').forEach(item => {
    const listType = item.closest('.task-card').classList[1]; // Gets 'daily', 'weekly', or 'monthly'
    tasks[listType].push({
      id: item.dataset.id,
      text: item.querySelector('label').textContent,
      completed: item.querySelector('input').checked
    });
  });
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || {};
  Object.keys(savedTasks).forEach(listType => {
    savedTasks[listType].forEach(task => {
      addTask(listType, task.text);
      const newItem = document.querySelector(`[data-id="${task.id}"]`);
      if (newItem && task.completed) {
        newItem.querySelector('input').checked = true;
        newItem.classList.add('completed');
      }
    });
  });
}

// Load tasks when page opens
loadTasks();
  });