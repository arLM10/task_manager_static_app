// Task Manager Application - Connected to Backend API
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;
let backendAvailable = false;

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize app
async function init() {
    // Check backend availability
    backendAvailable = await checkBackendAvailability();

    if (backendAvailable) {
        console.log('✓ Backend connected');
        // Load tasks from backend
        tasks = await fetchAllTasks();
        tasks = tasks.map(convertBackendTask);
    } else {
        console.warn('⚠️ Backend not available, using localStorage');
        // Fallback to localStorage
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    renderTasks();
    updateStats();
    setupFilterListeners();
}

// Setup filter button listeners
function setupFilterListeners() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update filter
            currentFilter = this.getAttribute('data-filter');
            renderTasks();
            updateStats();
        });
    });
}

// Add new task
async function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    if (backendAvailable) {
        // Add to backend
        const backendTask = await createTaskAPI(text);
        if (backendTask) {
            tasks.push(convertBackendTask(backendTask));
            showNotification('Task created successfully', 'success');
        } else {
            return; // Error already shown by API
        }
    } else {
        // Add to local storage
        const task = {
            id: Date.now(),
            text: text,
            description: '',
            completed: false,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        tasks.push(task);
        saveTasks();
        showNotification('Task saved locally', 'info');
    }

    taskInput.value = '';
    renderTasks();
    updateStats();
}

// Save tasks to localStorage (fallback)
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
    const timestamp = new Date().toISOString();
    localStorage.setItem('lastSaved', timestamp);
    sessionStorage.setItem('lastSaved', timestamp);
}

// Render tasks based on current filter
function renderTasks() {
    let filteredTasks = tasks;

    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    taskList.innerHTML = '';

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}
                   onchange="toggleTask(${task.id})">
            <span class="${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</span>
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Toggle task completion
async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;
    task.status = task.completed ? 'completed' : 'pending';

    if (backendAvailable) {
        const updated = await updateTaskAPI(id, { status: task.status });
        if (!updated) {
            // Revert on error
            task.completed = !task.completed;
            task.status = task.completed ? 'completed' : 'pending';
            return;
        }
    } else {
        saveTasks();
    }

    renderTasks();
    updateStats();
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    if (backendAvailable) {
        const deleted = await deleteTaskAPI(id);
        if (!deleted) return;
    }

    tasks = tasks.filter(t => t.id !== id);

    if (!backendAvailable) {
        saveTasks();
    }

    renderTasks();
    updateStats();
    showNotification('Task deleted', 'success');
}

// Edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editingTaskId = id;

    // Find the task item in DOM and replace with edit mode
    const taskItems = document.querySelectorAll('.task-item');
    const taskItem = Array.from(taskItems).find(item => {
        const button = item.querySelector('[onclick*="deleteTask"]');
        return button && button.getAttribute('onclick').includes(`deleteTask(${id})`);
    });

    if (taskItem) {
        taskItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}
                   onchange="toggleTask(${task.id})" disabled>
            <input type="text" class="edit-input" id="editInput${id}"
                   value="${escapeHtml(task.text)}" placeholder="Edit task...">
            <button class="save-btn" onclick="saveEdit(${id})">Save</button>
            <button class="cancel-btn" onclick="cancelEdit(${id})">Cancel</button>
        `;

        // Focus on input and select all text
        const input = document.getElementById(`editInput${id}`);
        input.focus();
        input.select();
    }
}

// Save edited task
async function saveEdit(id) {
    const input = document.getElementById(`editInput${id}`);
    const newText = input.value.trim();

    if (newText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.text = newText;

    if (backendAvailable) {
        const updated = await updateTaskAPI(id, { title: newText });
        if (!updated) {
            // Revert on error
            task.text = input.value;
            renderTasks();
            return;
        }
    } else {
        saveTasks();
    }

    editingTaskId = null;
    renderTasks();
    updateStats();
    showNotification('Task updated', 'success');
}

// Cancel edit mode
function cancelEdit(id) {
    editingTaskId = null;
    renderTasks();
    updateStats();
}

// Update statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    const statsElement = document.getElementById('stats');
    if (statsElement) {
        statsElement.textContent = `Total: ${totalTasks} | Completed: ${completedTasks}`;
    }

    // Update storage info display
    updateStorageInfo();
}

// Display storage information
function updateStorageInfo() {
    const storageInfoElement = document.getElementById('storageInfo');
    if (storageInfoElement) {
        const backendStatus = backendAvailable ? '✓ Connected' : '⚠️ Using localStorage';
        const backendColor = backendAvailable ? '#28a745' : '#ff9800';
        const dataSource = backendAvailable ? 'Backend (MySQL)' : 'Browser Storage';

        storageInfoElement.innerHTML = `
            <div class="storage-info">
                <p><strong>Data Source:</strong> <span style="color: ${backendColor};">${dataSource}</span></p>
                <p style="color: ${backendColor};"><strong>${backendStatus}</strong></p>
                <p>📦 Tasks in memory: ${tasks.length}</p>
            </div>
        `;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// Allow Enter key to add tasks
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    if (taskInput) {
        taskInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                addTask();
            }
        });
    }
});
