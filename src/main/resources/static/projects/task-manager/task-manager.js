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
    fetch('http://localhost:8080/tasks/addTask', {
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
        }, 100);
    })
    .catch(error => {
        // Handle errors if any
        console.error(error);
    });
}

// Attach event listener to the form to handle form submission
document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addTask(); // Call the addTask function when the form is submitted
});

// Function to retrieve tasks from the backend
function getTasks() {
    fetch('http://localhost:8080/tasks/getTasks') // Send a GET request to the /tasks/getTitle endpoint
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
            <input type="checkbox" class="delete-checkbox" id="delete-${task.id}">
            <p>Title: ${task.title}</p>
            <p>Priority: ${task.priority ? 'High' : 'Low'}</p>
        `;
        taskDisplay.appendChild(taskItem);
    });
}

// Function to clear all tasks
function clearAllTasks() {
    console.log('Clear all tasks button clicked'); // for debugging
    fetch('http://localhost:8080/tasks', {
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
  fetch('http://localhost:8080/tasks/deleteSelected', {
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

