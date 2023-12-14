function addTask() {
    const taskInput = document.getElementById('task-input').value;
    const priorityCheckbox = document.getElementById('priority').checked;
    console.log('addTask() function called');

    // Create the task object
    const task = {
        title: taskInput,
        priority: priorityCheckbox
    };

    // Send the POST request to the backend
    fetch('https://localhost:8080/tasks/addTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Error adding task: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data:', data);
        // Task added successfully, update the task list display
        getTasks();
        setTimeout(() => {
            document.getElementById('task-input').value = '';
            document.getElementById('priority').checked = false;
        }, 100);
    })
    .catch(error => {
        // Handle errors if any
        console.error(error);
    });
}

window.onload = function() {
    var taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', function(event) {
            event.preventDefault();
            addTask();
        });
    }
};

// Function to retrieve tasks from the backend
// Send a GET request to the /tasks/getTitle endpoint
function getTasks() {
    fetch('https://localhost:8080/tasks/getTasks')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error retrieving tasks: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // 'data' will contain the list of tasks from the backend
            // Update the task display container with the retrieved tasks
            updateTaskDisplay(data);
        })
        .catch(error => {
            // Handle errors if any
            console.error(error);
        });
}

// Function to update the task display container with the retrieved tasks
function updateTaskDisplay(tasks) {
    const taskDisplay = document.getElementById('task-display');

    // Clear the existing content in the task display container
    taskDisplay.innerHTML = '';

    // Loop through the tasks and create HTML elements to display them
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <div class="task-container">
                <input type="checkbox" class="delete-checkbox" id="delete-${task.id}">
                <div class="task-content">
                    <p class="task-title">${task.title}</p>
                </div>
                <p class="task-priority">${task.priority ? 'High' : 'Low'}</p>
            </div>
        `;
        taskDisplay.appendChild(taskItem);
    });
}

// Function to clear all tasks
function clearAllTasks() {
    console.log('Clear all tasks button clicked'); // for debugging
    fetch('https://localhost:8080/tasks', {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Response status:', response.status); // for debugging
        if (!response.ok) {
            throw new Error('Error clearing tasks: ' + response.status);
        }
        // Once tasks are cleared, update the task display container
        getTasks();
    })
    .catch(error => {
        console.error(error);
    });
}

// Function to delete selected tasks
function deleteTask() {
  const deleteCheckboxes = document.querySelectorAll('.delete-checkbox:checked');
  const taskIds = Array.from(deleteCheckboxes).map(checkbox => parseInt(checkbox.id.split('-')[1]));

  if (taskIds.length === 0) {
    console.log('No tasks selected for deletion.');
    return;
  }

  // Send the DELETE request to the backend with the selected task IDs
  fetch('https://localhost:8080/tasks/deleteSelected', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskIds)
  })
    .then(response => {
      console.log('Response status:', response.status); // for debugging
      if (!response.ok) {
        throw new Error('Error deleting tasks: ' + response.status);
      }
      // update task display container when deleting tasks
      getTasks();
    })
    .catch(error => {
      console.error('Error deleting tasks:', error);
    });
}

