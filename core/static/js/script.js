// Application State
let currentUser = null;
let projects = [];
let currentProject = null;
let tasks = [];
let currentTask = null;

// DOM Elements
const screens = {
    login: document.getElementById('login-screen'),
    signup: document.getElementById('signup-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    projectDetail: document.getElementById('project-detail-screen'),
    taskDetail: document.getElementById('task-detail-screen'),
    profile: document.getElementById('profile-screen')
};

const modals = {
    addProject: document.getElementById('add-project-modal'),
    addTask: document.getElementById('add-task-modal')
};

// Navigation Functions
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function showModal(modalName) {
    modals[modalName].classList.add('active');
}

function hideModal(modalName) {
    modals[modalName].classList.remove('active');
}

// Sample Data
const sampleProjects = [
    {
        id: 1,
        name: "Website Redesign",
        description: "Complete redesign of company website",
        tasks: [
            { id: 1, title: "Create wireframes", description: "Design wireframes for main pages", assignee: "john-doe", dueDate: "2025-09-15", status: "completed" },
            { id: 2, title: "Develop homepage", description: "Code the new homepage design", assignee: "jane-smith", dueDate: "2025-09-20", status: "in-progress" },
            { id: 3, title: "User testing", description: "Conduct user testing sessions", assignee: "mike-johnson", dueDate: "2025-09-25", status: "todo" }
        ]
    },
    {
        id: 2,
        name: "Mobile App Development",
        description: "Build native mobile application",
        tasks: [
            { id: 4, title: "Setup development environment", description: "Configure React Native environment", assignee: "john-doe", dueDate: "2025-09-18", status: "completed" },
            { id: 5, title: "Implement authentication", description: "Add login and signup functionality", assignee: "jane-smith", dueDate: "2025-09-22", status: "todo" }
        ]
    }
];

// Initialize App
function initializeApp() {
    // Load sample data
    projects = [...sampleProjects];
    
    // Set up event listeners
    setupEventListeners();
    
    // Show login screen
    showScreen('login');
}

function setupEventListeners() {
    // Auth navigation
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('signup');
    });
    
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('login');
    });
    
    // Auth forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // Navigation buttons
    document.getElementById('profile-btn').addEventListener('click', () => showScreen('profile'));
    document.getElementById('back-to-dashboard').addEventListener('click', () => showScreen('dashboard'));
    document.getElementById('back-to-project').addEventListener('click', () => showScreen('projectDetail'));
    document.getElementById('back-from-profile').addEventListener('click', () => showScreen('dashboard'));
    
    // Action buttons
    document.getElementById('add-project-btn').addEventListener('click', () => showModal('addProject'));
    document.getElementById('add-task-btn').addEventListener('click', () => showModal('addTask'));
    
    // Modal controls
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = e.target.closest('.modal');
            modal.classList.remove('active');
        });
    });
    
    // Forms
    document.getElementById('project-form').addEventListener('submit', handleCreateProject);
    document.getElementById('task-form').addEventListener('submit', handleCreateTask);
    
    // Task status change
    document.getElementById('task-status-select').addEventListener('change', handleStatusChange);
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

// Auth Functions
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation (in real app, this would be server-side)
    if (email && password) {
        currentUser = {
            name: "John Doe",
            email: email,
            initials: "JD"
        };
        
        showScreen('dashboard');
        updateDashboard();
        updateProfile();
    }
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    if (name && email && password) {
        currentUser = {
            name: name,
            email: email,
            initials: name.split(' ').map(n => n[0]).join('').toUpperCase()
        };
        
        showScreen('dashboard');
        updateDashboard();
        updateProfile();
    }
}

function handleLogout() {
    currentUser = null;
    currentProject = null;
    currentTask = null;
    showScreen('login');
    
    // Reset forms
    document.getElementById('login-form').reset();
    document.getElementById('signup-form').reset();
}

// Dashboard Functions
function updateDashboard() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsList.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => openProject(project);
    
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    const totalTasks = project.tasks.length;
    
    card.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="task-meta">
            <span>${completedTasks}/${totalTasks} tasks completed</span>
        </div>
    `;
    
    return card;
}

// Project Functions
function openProject(project) {
    currentProject = project;
    tasks = [...project.tasks];
    
    document.getElementById('project-title').textContent = project.name;
    updateProjectStats();
    updateTasksList();
    showScreen('projectDetail');
}

function updateProjectStats() {
    if (!currentProject) return;
    
    const totalTasks = currentProject.tasks.length;
    const completedTasks = currentProject.tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('pending-tasks').textContent = pendingTasks;
}

function updateTasksList() {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksList.appendChild(taskCard);
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.status}`;
    card.onclick = () => openTask(task);
    
    const assigneeNames = {
        'john-doe': 'John Doe',
        'jane-smith': 'Jane Smith',
        'mike-johnson': 'Mike Johnson'
    };
    
    const statusLabels = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'completed': 'Completed'
    };
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${task.title}</div>
            <span class="task-status ${task.status}">${statusLabels[task.status]}</span>
        </div>
        <div class="task-meta">
            <div class="task-assignee">
                <div class="avatar">${task.assignee.split('-').map(n => n[0]).join('').toUpperCase()}</div>
                <span>${assigneeNames[task.assignee]}</span>
            </div>
            <span>${new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
    `;
    
    return card;
}

// Task Functions
function openTask(task) {
    currentTask = task;
    
    const assigneeNames = {
        'john-doe': 'John Doe',
        'jane-smith': 'Jane Smith',
        'mike-johnson': 'Mike Johnson'
    };
    
    document.getElementById('task-detail-title').textContent = task.title;
    document.getElementById('task-detail-description').textContent = task.description;
    document.getElementById('task-detail-assignee').textContent = assigneeNames[task.assignee];
    document.getElementById('task-detail-due-date').textContent = new Date(task.dueDate).toLocaleDateString();
    document.getElementById('task-status-select').value = task.status;
    
    showScreen('taskDetail');
}

function handleStatusChange(e) {
    if (currentTask) {
        currentTask.status = e.target.value;
        
        // Update in project tasks
        const projectTask = currentProject.tasks.find(task => task.id === currentTask.id);
        if (projectTask) {
            projectTask.status = e.target.value;
        }
        
        // Update tasks array
        const taskIndex = tasks.findIndex(task => task.id === currentTask.id);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = e.target.value;
        }
    }
}

// Create Functions
function handleCreateProject(e) {
    e.preventDefault();
    
    const name = document.getElementById('project-name').value;
    const description = document.getElementById('project-description').value;
    
    const newProject = {
        id: projects.length + 1,
        name: name,
        description: description,
        tasks: []
    };
    
    projects.push(newProject);
    updateDashboard();
    hideModal('addProject');
    
    // Reset form
    document.getElementById('project-form').reset();
}

function handleCreateTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const assignee = document.getElementById('task-assignee').value;
    const dueDate = document.getElementById('task-due-date').value;
    
    const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        assignee: assignee,
        dueDate: dueDate,
        status: 'todo'
    };
    
    currentProject.tasks.push(newTask);
    tasks.push(newTask);
    
    updateProjectStats();
    updateTasksList();
    hideModal('addTask');
    
    // Reset form
    document.getElementById('task-form').reset();
}

// Profile Functions
function updateProfile() {
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('user-avatar').textContent = currentUser.initials;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
