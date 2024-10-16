// Document ready function
$(function () {
    // Make it so you can hit Enter to create a new task in addition to clicking the Add button
    $('#input-container').on( "submit", function(event) {
        event.preventDefault();

        // Make add button become bright for a sec
        const addButton = $('#addButton');
        addButton.css('filter', 'brightness(1.3)');
        // Revert the filter back to normal after
        setTimeout(function() {
            addButton.css('filter', 'brightness(1)');
        }, 200);
    });
});

// Show top navbar when you scroll down
window.onscroll = function() {
    const navbar = document.querySelector('.top-nav');
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navbar.classList.add('scrolled'); // Add the scrolled class
    } else {
        navbar.classList.remove('scrolled'); // Remove the scrolled class
    }
};

// Function to automatically collapse username on small screens
function handleResize() {
    const username = document.querySelector('.username');

    // Hide username if screen is too small
    if (window.innerWidth <= 600) { 
        username.style.display = 'none';
    } else {
        username.style.display = 'flex';
    }
}

// Add an event listener for window resize
window.addEventListener('resize', handleResize);

function toggleLightDarkMode() {
    const lightDarkIcon = document.getElementById('lightdarkIcon');
    const body = document.body;
    
    // Toggle light/dark mode
    body.classList.toggle('dark-mode');
    
    // Swap icon colors
    if (lightDarkIcon.src.includes('lightdark-icon-white.png')) {
        lightDarkIcon.src = './img/lightdark-icon-black.png';
    } else {
        lightDarkIcon.src = './img/lightdark-icon-white.png';
    }
}



// Task List Functions

// Fetch and display tasks when the page loads
$(document).ready(function() {
    if (sessionStorage.getItem('token') !== null) {
        fetchTasks();
    } else {
        window.location.href = "index.html"; // Redirect to the home page
    }
});

async function fetchConfig() {
    const response = await fetch('/api/config');
    const config = await response.json();
    return config.apiBaseUrl;
}

async function fetchTasks() {
    const apiBaseUrl = await fetchConfig();
    const token = sessionStorage.getItem('token'); // Get the token from session storage
    const response = await fetch(`${apiBaseUrl}/api/tasks`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the request
        }
    });
    const tasks = await response.json();
    
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear the list

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <div class="circle ${task.completed ? 'completed' : ''}" onclick="taskCompleted(event, '${task._id}')"></div>
            <div class="task-input task-text ${task.completed ? 'completed' : ''}" contenteditable="true" onblur="updateTask(event, '${task._id}')">${task.text}</div>
            <img src="./img/delete.png" class="delete-button" onclick="deleteTask(event, '${task._id}')" alt="Delete"/>
        `;
        taskList.appendChild(taskItem);
    });
}

async function addTask() {
    const input = document.getElementById('newTaskInput');
    if (input.value.trim() === '') return;

    const newTask = {
        text: input.value
    };
    
    const apiBaseUrl = await fetchConfig();
    const token = sessionStorage.getItem('token');

    await fetch(`${apiBaseUrl}/api/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newTask)
    });

    input.value = ''; // Clear input
    fetchTasks(); // Refresh task list
}

async function deleteTask(event, taskId) {
    const apiBaseUrl = await fetchConfig();
    const token = sessionStorage.getItem('token');

    await fetch(`${apiBaseUrl}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    fetchTasks(); // Refresh task list
}

async function updateTask(event, taskId) {
    const taskText = event.target.textContent;
    const apiBaseUrl = await fetchConfig();
    const token = sessionStorage.getItem('token');

    await fetch(`${apiBaseUrl}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: taskText })
    });

    fetchTasks(); // Refresh task list
}

async function taskCompleted(event, taskId) {
    const listItem = event.currentTarget.closest('li');
    const taskInput = listItem.querySelector('.task-text');
    const circle = listItem.querySelector('.circle');
    const apiBaseUrl = await fetchConfig();
    const token = sessionStorage.getItem('token');

    // Determine the new completion state
    const isCompleted = !taskInput.classList.contains('completed');

    if (taskInput && circle) {
        taskInput.classList.toggle('completed', isCompleted); 
        circle.classList.toggle('completed', isCompleted);
    }
    // Trigger confetti effect if task completed
    if (isCompleted) {
        createConfetti();
    }

    await fetch(`${apiBaseUrl}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: isCompleted })
    });
}



function createConfetti() {
    const numConfetti = 900; // Number of confetti pieces
    const colors = [
        '#FF5733', // Red
        '#FFC300', // Yellow
        '#DAF7A6', // Light Green
        '#33FF57', // Green
        '#337FFF', // Blue
        '#FF33A1', // Pink
        '#FF8C33', // Orange
        '#8D33FF'  // Purple
    ];

    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Randomize size
        const sizeClass = Math.random() > 0.5 ? 'confetti-small' : Math.random() > 0.5 ? 'confetti-large' : '';
        if (sizeClass) {
            confetti.classList.add(sizeClass);
        }

        // Randomize horizontal position
        confetti.style.left = `${Math.random() * 100}vw`; // Full width of viewport
        confetti.style.top = `-20px`; // Start from the top

        // Randomize color
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Add a random delay for each piece
        confetti.style.animationDelay = `${Math.random() * 2}s`;

        document.body.appendChild(confetti);

        // Remove the confetti after the animation ends
        confetti.addEventListener('animationend', () => {
            confetti.remove();
        });
    }
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// User profile dropdown menu
function toggleDropdown() {
    const dropdown = document.getElementById("userDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

$(document).ready(function() {
    // Retrieve username from sessionStorage
    const username = sessionStorage.getItem('username');

    // Check if username exists, then update the UI
    if (username) {
        document.querySelector('.username').textContent = `Welcome, ${username.charAt(0).toUpperCase() + username.slice(1)}`;
        document.querySelector('.user-circle').textContent = username.charAt(0).toUpperCase();
        document.querySelector('.dropdown-username').textContent = username;
    }

    // Call the function on page load to ensure layout is correct
    handleResize();
});

window.onclick = function(event) {
    const userDropdown = document.getElementById("userDropdown");
    if (!event.target.matches('.user-circle')) {
        if (userDropdown.style.display === "block") {
            userDropdown.style.display = "none";
        }
    }
};
