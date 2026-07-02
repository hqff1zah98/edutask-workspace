// ================= DATA STATE STORAGE =================
let currentUser = null;
let tasksArray = [];
let subjectsArray = [];
let progressChartInstance = null;
let hoursChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Session check validation
    const activeSession = localStorage.getItem("beginner_activeSession");
    if (!activeSession) {
        window.location.href = "index.html"; 
        return;
    }
    currentUser = activeSession;
    document.getElementById('welcomeName').innerText = currentUser;

    // dummy data
    if (!localStorage.getItem(`${currentUser}_subjects`)) {
        const dummySubjects = [
            { code: "IMS566", name: "Advanced Web Design Development and Content Management" },
            { code: "IMS565", name: "Information Systems Project Management" }
            { code: "IMS560", name: "Advanced Database Management" }
        ];
        localStorage.setItem(`${currentUser}_subjects`, JSON.stringify(dummySubjects));
    }
    // data dummy
    if (!localStorage.getItem(`${currentUser}_tasks`)) {
        const dummyTasks = [
            { name: "Individual Assignment 1", subject: "IMS566", hours: 5, status: "Pending" },
            { name: "Group Project Proposal", subject: "IMS552", hours: 3, status: "Completed" }
        ];
        localStorage.setItem(`${currentUser}_tasks`, JSON.stringify(dummyTasks));
    }
    // -------------------------------------------------------

    // 2. Load stored datasets mengikut akaun pengguna
    tasksArray = JSON.parse(localStorage.getItem(`${currentUser}_tasks`)) || [];
    subjectsArray = JSON.parse(localStorage.getItem(`${currentUser}_subjects`)) || [];
    
    // 3. Render dashboard
    renderDashboard();
});

window.renderDashboard = function() {
    const total = tasksArray.length;
    const completed = tasksArray.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    
    document.getElementById('statTotal').innerText = total;
    document.getElementById('statPending').innerText = pending;
    document.getElementById('statCompleted').innerText = completed;
    document.getElementById('statSubjects').innerText = subjectsArray.length;
    
    // Priority Table Preview List
    const tbody = document.getElementById('dashboardTasksTable');
    tbody.innerHTML = '';
    const activeTasks = tasksArray.filter(t => t.status === 'Pending').slice(0, 3);
    
    if (activeTasks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">All assigned tasks completed!</td></tr>`;
    } else {
        activeTasks.forEach((task) => {
            const originalIndex = tasksArray.findIndex(t => t.name === task.name);
            tbody.innerHTML += `
                <tr>
                    <td class="fw-semibold">${task.name}</td>
                    <td><span class="badge bg-secondary font-mono">${task.subject}</span></td>
                    <td>${task.hours} hours</td>
                    <td class="text-center">
                        <button onclick="quickCompleteTask(${originalIndex})" class="btn btn-outline-success btn-xs py-0 px-2 small bg-transparent">
                            Mark Done
                        </button>
                    </td>
                </tr>
            `;
        });
    }
    updatePerformanceCharts(completed, pending);
}

window.quickCompleteTask = function(index) {
    tasksArray[index].status = "Completed";
    // save for user
    localStorage.setItem(`${currentUser}_tasks`, JSON.stringify(tasksArray));
    renderDashboard();
}

window.updatePerformanceCharts = function(completed, pending) {
    // Doughnut Chart Setup
    const progressCanvas = document.getElementById('progressChart');
    if (progressChartInstance !== null) { progressChartInstance.destroy(); }
    progressChartInstance = new Chart(progressCanvas, {
        type: 'doughnut',
        data: {
            labels: ['Pending Tasks', 'Completed Tasks'],
            datasets: [{
                data: [pending, completed],
                backgroundColor: ['#f39eb6', '#f7f6d3'],
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });

    // Bar Chart Setup
    const hoursCanvas = document.getElementById('hoursChart');
    const subjectsMap = {};
    subjectsArray.forEach(sub => subjectsMap[sub.code] = 0);
    tasksArray.forEach(task => {
        if (subjectsMap[task.subject] !== undefined) {
            subjectsMap[task.subject] += Number(task.hours);
        }
    });

    if (hoursChartInstance !== null) { hoursChartInstance.destroy(); }
    hoursChartInstance = new Chart(hoursCanvas, {
        type: 'bar',
        data: {
            labels: Object.keys(subjectsMap),
            datasets: [{
                label: 'Estimated Workload Hours',
                data: Object.values(subjectsMap),
                backgroundColor: 'rgba(75, 184, 250, 1)',
                borderColor: '#4bb8fa',
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
}

window.toggleMobileMenu = function() {
    document.getElementById('mainNavbar').classList.toggle('show');
}

window.handleLogout = function() {
    localStorage.removeItem("beginner_activeSession");
    window.location.href = "index.html";
}

// real time sync
window.addEventListener('storage', (e) => {
    if (e.key === `${currentUser}_tasks` || e.key === `${currentUser}_subjects`) {
        tasksArray = JSON.parse(localStorage.getItem(`${currentUser}_tasks`)) || [];
        subjectsArray = JSON.parse(localStorage.getItem(`${currentUser}_subjects`)) || [];
        renderDashboard(); 
    }
});
