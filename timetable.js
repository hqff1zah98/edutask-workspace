// ================= DATA STATE STORAGE =================
let timetableSlots = [];
let subjectsArray = [];
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const activeSession = localStorage.getItem("beginner_activeSession");
    if (!activeSession) {
        window.location.href = "index.html";
        return;
    }
    currentUser = activeSession;

    // data dummy for timetable
    if (!localStorage.getItem(`${currentUser}_timetable`)) {
        const dummyTimetable = [
            { id: 1, subject: "IMS566", day: "Monday", start: "08:00", end: "10:00", room: "Computer Lab 1" },
            { id: 2, subject: "IMS552", day: "Wednesday", start: "14:00", end: "16:00", room: "DK 200" }
        ];
        localStorage.setItem(`${currentUser}_timetable`, JSON.stringify(dummyTimetable));
    }

    timetableSlots = JSON.parse(localStorage.getItem(`${currentUser}_timetable`)) || [];
    subjectsArray = JSON.parse(localStorage.getItem(`${currentUser}_subjects`)) || [];
    
    populateSubjectDropdown();
    renderTimetableSlots();
});

window.populateSubjectDropdown = function() {
    const slotDropdown = document.getElementById('slotSubject');
    if (slotDropdown) {
        if(subjectsArray.length === 0){
             slotDropdown.innerHTML = `<option value="">Add subject first...</option>`;
        } else {
             slotDropdown.innerHTML = subjectsArray.map(sub => `<option value="${sub.code}">${sub.code}</option>`).join('');
        }
    }
}

window.renderTimetableSlots = function() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // clear existing HTML in day columns
    days.forEach(dayName => {
        const col = document.getElementById(`day-${dayName}`);
        if (col) col.innerHTML = '';
    });
    
    timetableSlots.forEach(slot => {
        const container = document.getElementById(`day-${slot.day}`);
        if(container) {
            container.innerHTML += `
                <div class="p-2 bg-light border rounded shadow-xs relative-slot mb-2" style="font-size: 0.85rem;">
                    <div class="d-flex justify-content-between align-items-start gap-1">
                        <strong class="text-primary font-mono text-truncate">${slot.subject}</strong>
                        <button onclick="handleDeleteSlot(${slot.id})" class="btn btn-xs p-0 text-danger border-0 bg-transparent">
                            <i class="fa-solid fa-circle-xmark"></i>
                        </button>
                    </div>
                    <div class="small mt-1 text-muted">
                        <i class="fa-regular fa-clock"></i> ${slot.start} - ${slot.end}
                    </div>
                    <div class="small text-muted truncate-text">
                        <i class="fa-solid fa-location-dot"></i> ${slot.room}
                    </div>
                </div>
            `;
        }
    });

    // set placeholder if empty
    days.forEach(dayName => {
        const div = document.getElementById(`day-${dayName}`);
        if (div && div.children.length === 0) {
            div.innerHTML = `<span class="text-muted text-center d-block py-4 small">No sessions scheduled</span>`;
        }
    });
}

window.handleAddTimetableSlot = function(event) {
    event.preventDefault();
    const subject = document.getElementById('slotSubject').value;
    const day = document.getElementById('slotDay').value;
    const start = document.getElementById('slotStart').value;
    const end = document.getElementById('slotEnd').value;
    const room = document.getElementById('slotRoom').value.trim();
    
    if(!subject) {
        alert("Please register a subject first!");
        return;
    }
    if(start >= end) {
        alert("Timetable conflict: Session end time cannot precede starting time.");
        return;
    }
    
    const newSlot = { id: Date.now(), subject, day, start, end, room };
    timetableSlots.push(newSlot);
    localStorage.setItem(`${currentUser}_timetable`, JSON.stringify(timetableSlots)); // Simpan ikut user
    
    showNotification("Timetable session entry mapped!");
    document.getElementById('timetableForm').reset();
    renderTimetableSlots();
}

window.handleDeleteSlot = function(id) {
    timetableSlots = timetableSlots.filter(s => s.id !== id);
    localStorage.setItem(`${currentUser}_timetable`, JSON.stringify(timetableSlots)); // Simpan ikut user
    showNotification("Timetable slot removed.");
    renderTimetableSlots();
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
    if (e.key === `${currentUser}_timetable` || e.key === `${currentUser}_subjects`) {
        timetableSlots = JSON.parse(localStorage.getItem(`${currentUser}_timetable`)) || [];
        subjectsArray = JSON.parse(localStorage.getItem(`${currentUser}_subjects`)) || [];
        populateSubjectDropdown();
        renderTimetableSlots();
    }
});