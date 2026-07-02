// ================= DATA STATE STORAGE =================
let tasksArray = []; 
let subjectsArray = []; 
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const activeSession = localStorage.getItem("beginner_activeSession");
    if (!activeSession) {
        window.location.href = "index.html";
        return;
    }
    currentUser = activeSession;
    
    // data dummy for task
    if (!localStorage.getItem(`${currentUser}_tasks`)) {
        const dummyTasks = [
            { name: "Individual Assignment 1", subject: "IMS566", hours: 5, status: "Pending" },
            { name: "Group Project Proposal", subject: "IMS565", hours: 3, status: "Completed" }
            { name: "Group Project Php", subject: "IMS560", hours: 3, status: "Pending" }
        ];
        localStorage.setItem(`${currentUser}_tasks`, JSON.stringify(dummyTasks));
    }


    tasksArray = JSON.parse(localStorage.getItem(`${currentUser}_tasks`)) || [];
    subjectsArray = JSON.parse(localStorage.getItem(`${currentUser}_subjects`)) || [];
    
    populateSubjectDropdowns();
    renderTasksView();
});

window.populateSubjectDropdowns = function() {
    const taskDropdown = document.getElementById('taskSubject');
    if (taskDropdown) {
        // show subject, if no subject, show no message
        if(subjectsArray.length === 0){
             taskDropdown.innerHTML = `<option value="">Please add a subject first...</option>`;
        } else {
             taskDropdown.innerHTML = subjectsArray.map(sub => `<option value="${sub.code}">${sub.code}</option>`).join('');
        }
    }
}

window.renderTasksView = function() {
    const tbody = document.getElementById('tasksTableBody');
    tbody.innerHTML = '';
    const noTasksMsg = document.getElementById('noTasksMessage');
    
    if (tasksArray.length === 0) {
        noTasksMsg.classList.remove('d-none');
        return;
    }
    
    noTasksMsg.classList.add('d-none');
    tasksArray.forEach((task, index) => {
        const badgeColor = task.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark';
        tbody.innerHTML += `
            <tr>
                <td class="p-3 fw-semibold">${task.name}</td>
                <td class="p-3"><span class="badge bg-secondary font-mono">${task.subject}</span></td>
                <td class="p-3">${task.hours} hours</td>
                <td class="p-3"><span class="badge ${badgeColor}">${task.status}</span></td>
                <td class="p-3 text-end">
                    <button onclick="handleDeleteTask(${index})" class="btn btn-outline-danger btn-sm bg-transparent">
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

window.handleAddTask = function(event) {
    event.preventDefault();
    const name = document.getElementById('taskName').value.trim();
    const subject = document.getElementById('taskSubject').value;
    const hours = Number(document.getElementById('taskHours').value);
    const status = document.getElementById('taskStatus').value;
    
    if(!subject) {
        alert("Please register a subject in Subjects Register first!");
        return;
    }

    tasksArray.push({ name, subject, hours, status });
    localStorage.setItem(`${currentUser}_tasks`, JSON.stringify(tasksArray)); // Simpan ikut user
    
    showNotification("New assignment task logged!");
    document.getElementById('taskForm').reset();
    renderTasksView();
}

window.handleDeleteTask = function(index) {
    const verified = confirm(`Are you sure you want to remove this task: "${tasksArray[index].name}"?`);
    if (verified) {
        tasksArray.splice(index, 1);
        localStorage.setItem(`${currentUser}_tasks`, JSON.stringify(tasksArray)); // Simpan ikut user
        showNotification("Task record removed.");
        renderTasksView();
    }
}

window.showNotification = function(message) {
    const toast = document.getElementById('toastNotification');
    document.getElementById('toastMessage').innerText = message;
    toast.classList.remove('d-none');
    setTimeout(() => { toast.classList.add('d-none'); }, 3000);
}

window.toggleMobileMenu = function() { document.getElementById('mainNavbar').classList.toggle('show'); }
window.handleLogout = function() {
    localStorage.removeItem("beginner_activeSession");
    window.location.href = "index.html";
}

// real time sync
window.addEventListener('storage', (e) => {
    if (e.key === `${currentUser}_tasks` || e.key === `${currentUser}_subjects`) {
        tasksArray = JSON.parse(localStorage.getItem(`${currentUser}_tasks`)) || [];
        subjectsArray = JSON.parse(localStorage.getItem(`${currentUser}_subjects`)) || [];
        populateSubjectDropdowns();
        renderTasksView();
    }
});
