// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// ==================== API HELPER FUNCTIONS ====================

/**
 * Make API request with error handling
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * GET all tasks from backend
 */
async function fetchAllTasks() {
    try {
        const response = await apiRequest('/tasks');
        return response.tasks || [];
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        showNotification('Failed to load tasks: ' + error.message, 'error');
        return [];
    }
}

/**
 * GET single task by ID
 */
async function fetchTask(taskId) {
    try {
        const response = await apiRequest(`/tasks/${taskId}`);
        return response.task;
    } catch (error) {
        console.error('Failed to fetch task:', error);
        showNotification('Failed to load task: ' + error.message, 'error');
        return null;
    }
}

/**
 * POST - Create new task
 */
async function createTaskAPI(title, description = '') {
    try {
        const response = await apiRequest('/tasks', 'POST', {
            title: title,
            description: description,
            status: 'pending'
        });
        return response.task;
    } catch (error) {
        console.error('Failed to create task:', error);
        showNotification('Failed to create task: ' + error.message, 'error');
        return null;
    }
}

/**
 * PUT - Update task
 */
async function updateTaskAPI(taskId, updates) {
    try {
        const response = await apiRequest(`/tasks/${taskId}`, 'PUT', updates);
        return response.task;
    } catch (error) {
        console.error('Failed to update task:', error);
        showNotification('Failed to update task: ' + error.message, 'error');
        return null;
    }
}

/**
 * DELETE - Delete task
 */
async function deleteTaskAPI(taskId) {
    try {
        const response = await apiRequest(`/tasks/${taskId}`, 'DELETE');
        return true;
    } catch (error) {
        console.error('Failed to delete task:', error);
        showNotification('Failed to delete task: ' + error.message, 'error');
        return false;
    }
}

/**
 * Convert backend task format to frontend format
 */
function convertBackendTask(backendTask) {
    return {
        id: backendTask.id,
        text: backendTask.title,
        description: backendTask.description || '',
        completed: backendTask.status === 'completed',
        status: backendTask.status,
        createdAt: backendTask.created_at,
        updatedAt: backendTask.updated_at
    };
}

/**
 * Convert frontend task format to backend format
 */
function convertFrontendTask(frontendTask) {
    return {
        title: frontendTask.text || frontendTask.title,
        description: frontendTask.description || '',
        status: frontendTask.completed ? 'completed' : (frontendTask.status || 'pending')
    };
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to DOM
    const container = document.body;
    container.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

/**
 * Check if backend is available
 */
async function checkBackendAvailability() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        return response.ok;
    } catch (error) {
        console.warn('Backend not available:', error);
        return false;
    }
}
