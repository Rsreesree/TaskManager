let tasks = [];
let allPersons = [];
let currentStatusFilter = 'all';

document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
document.getElementById('dueDateInput').valueAsDate = new Date();

loadTasks();
loadPersons();

async function loadPersons() {
    try {
        const response = await fetch('/api/persons');
        allPersons = await response.json();
        updatePersonFilters();
    } catch (error) { console.error('Error loading persons:', error); }
}

function updatePersonFilters() {
    const personFilter = document.getElementById('personFilter');
    const personList = document.getElementById('personList');
    personFilter.innerHTML = '<option value="all">All People</option>';
    personList.innerHTML = '';
    allPersons.forEach(person => {
        const option = document.createElement('option');
        option.value = person;
        option.textContent = person;
        personFilter.appendChild(option.cloneNode(true));
        personList.appendChild(option);
    });
}

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        tasks = await response.json();
        renderTasks();
    } catch (error) { console.error('Error loading tasks:', error); }
}

async function applyFilters() {
    const dateFilter = document.getElementById('dateFilter').value;
    const personFilter = document.getElementById('personFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    let url = '/api/tasks?';
    const params = [];
    if (dateFilter) params.push(`date=${dateFilter}`);
    if (personFilter !== 'all') params.push(`person=${personFilter}`);
    if (priorityFilter !== 'all') params.push(`priority=${priorityFilter}`);
    url += params.join('&');
    try {
        const response = await fetch(url);
        tasks = await response.json();
        renderTasks();
    } catch (error) { console.error('Error filtering tasks:', error); }
}

function clearFilters() {
    document.getElementById('dateFilter').value = '';
    document.getElementById('personFilter').value = 'all';
    document.getElementById('priorityFilter').value = 'all';
    currentStatusFilter = 'all';
    document.querySelectorAll('.filter-btn').forEach(btn => { btn.classList.remove('active'); });
    document.querySelector('.filter-btn').classList.add('active');
    loadTasks();
}

function filterByStatus(status) {
    currentStatusFilter = status;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTasks();
}

async function addTask() {
    const input = document.getElementById('taskInput');
    const category = document.getElementById('categorySelect').value;
    const priority = document.getElementById('prioritySelect').value;
    const person = document.getElementById('personInput').value.trim();
    const contact = document.getElementById('contactInput').value.trim();
    const dueDate = document.getElementById('dueDateInput').value;
    const text = input.value.trim();

    if (!text) { alert('Please enter a task description'); return; }
    if (!dueDate) { alert('Please select a due date'); return; }

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, category, priority, assignedTo: person, contact, dueDate })
        });
        const newTask = await response.json();
        tasks.push(newTask);
        input.value = '';
        document.getElementById('personInput').value = '';
        document.getElementById('contactInput').value = '';
        await loadPersons();
        renderTasks();
    } catch (error) { console.error('Error adding task:', error); }
}

async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
        await fetch(`/api/tasks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: !task.completed }) });
        task.completed = !task.completed;
        renderTasks();
    } catch (error) { console.error('Error updating task:', error); }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    } catch (error) { console.error('Error deleting task:', error); }
}

// CALL function
function callTask(contact) { 
    if (!contact) return; 
    window.location.href = `tel:${contact}`; 
}

// MESSAGE function (SMS or Email)
function messageTask(contact, taskText) {
    if (!contact) return;

    const isEmail = contact.includes('@');

    if (isEmail) {
        const subject = encodeURIComponent("Regarding your task");
        const body = encodeURIComponent(`Task: ${taskText}`);
        window.location.href = `mailto:${contact}?subject=${subject}&body=${body}`;
    } else {
        const message = encodeURIComponent(`Regarding task: ${taskText}`);
        window.location.href = `sms:${contact}?body=${message}`;
    }
}

function getDueDateStatus(dueDate) {
    if (!dueDate) return '';
    const today = new Date(); today.setHours(0,0,0,0);
    const due = new Date(dueDate); due.setHours(0,0,0,0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000*60*60*24));
    if (diffDays < 0) return `<span class="overdue">⚠️ Overdue by ${Math.abs(diffDays)} day(s)</span>`;
    else if (diffDays === 0) return '<span class="due-soon">📅 Due Today</span>';
    else if (diffDays === 1) return '<span class="due-soon">📅 Due Tomorrow</span>';
    else if (diffDays <= 3) return `<span class="due-soon">📅 Due in ${diffDays} days</span>`;
    else return `📅 Due ${new Date(dueDate).toLocaleDateString()}`;
}

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    let filteredTasks = tasks;
    if (currentStatusFilter === 'active') filteredTasks = tasks.filter(t => !t.completed);
    else if (currentStatusFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

    filteredTasks.sort((a,b) => { const order = { high:0, medium:1, low:2 }; if(order[a.priority]!==order[b.priority]) return order[a.priority]-order[b.priority]; return new Date(a.dueDate)-new Date(b.dueDate); });

    const today = new Date(); today.setHours(0,0,0,0);
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('highPriority').textContent = tasks.filter(t => t.priority==='high' && !t.completed).length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
    document.getElementById('overdueTasks').textContent = tasks.filter(t => { if(t.completed || !t.dueDate) return false; const due=new Date(t.dueDate); due.setHours(0,0,0,0); return due<today; }).length;

    if(filteredTasks.length===0) { container.innerHTML = '<div class="empty-state">No tasks to display</div>'; return; }

    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item priority-${task.priority} ${task.completed ? 'completed':''}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked':''} onchange="toggleTask(${task.id})">
            <div class="task-content">
                <div class="task-header">
                    <div class="task-text">${task.text}</div>
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                </div>
                <div class="task-meta">
                    <span class="task-meta-item"><span class="task-category category-${task.category}">${task.category}</span></span>
                    ${task.assignedTo ? `<span class="task-meta-item">👤 ${task.assignedTo}</span>` : ''}
                    ${task.contact ? `<span class="task-meta-item">📱 ${task.contact}</span>` : ''}
                    <span class="task-meta-item">${getDueDateStatus(task.dueDate)}</span>
                </div>
            </div>
            <div class="task-actions">
                ${task.contact ? `<button class="call-btn" onclick="callTask('${task.contact}')">📞 Call</button>
                <button class="message-btn" onclick="messageTask('${task.contact}','${task.text}')">✉️ Message</button>` : ''}
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

document.getElementById('taskInput').addEventListener('keypress', (e) => { if(e.key==='Enter') addTask(); });
