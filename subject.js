// ================= DATA STATE STORAGE =================
let subjectsArray = [];
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const activeSession = localStorage.getItem("beginner_activeSession");
    if (!activeSession) {
        window.location.href = "index.html";
        return;
    }
    currentUser = activeSession;

    // DUmmy data
    if (!localStorage.getItem(`${currentUser}_subjects`)) {
        const dummySubjects = [
            { code: "IMS566", name: "Advanced Web Design" },
            { code: "IMS552", name: "Information Systems" }
        ];
        localStorage.setItem(`${currentUser}_subjects`, JSON.stringify(dummySubjects));
    }

    subjectsArray = JSON.parse(localStorage.getItem(`${currentUser}_subjects`)) || [];
    renderSubjectsView();
});

window.renderSubjectsView = function() {
    const grid = document.getElementById('subjectsGrid');
    grid.innerHTML = '';
    subjectsArray.forEach((sub, index) => {
        grid.innerHTML += `
            <div class="col-12 col-sm-6 col-lg-4">
                <div class="card p-3 shadow-sm border border-light bg-white h-100 d-flex flex-row justify-content-between align-items-start">
                    <div>
                        <span class="badge bg-primary text-uppercase font-mono">${sub.code}</span>
                        <h5 class="fw-bold mt-2 mb-0">${sub.name}</h5>
                    </div>
                    <button onclick="handleDeleteSubject(${index})" class="btn text-muted hover-red p-1 border-0 bg-transparent">
                        <i class="fa-solid fa-square-xmark fa-lg text-danger"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

window.handleAddSubject = function(event) {
    event.preventDefault();
    const code = document.getElementById('subjCode').value.trim().toUpperCase();
    const name = document.getElementById('subjName').value.trim();
    const exists = subjectsArray.some(sub => sub.code === code);
    
    if(exists) {
        alert("Subject code is already registered.");
        return;
    }
    
    subjectsArray.push({ code, name });
    localStorage.setItem(`${currentUser}_subjects`, JSON.stringify(subjectsArray)); // Simpan ikut user
    
    showNotification("Subject code added!");
    document.getElementById('subjectForm').reset();
    renderSubjectsView();
}

window.handleDeleteSubject = function(index) {
    const code = subjectsArray[index].code;
    const verified = confirm(`Are you sure you want to delete subject: "${code}"?`);
    if (verified) {
        subjectsArray.splice(index, 1);
        localStorage.setItem(`${currentUser}_subjects`, JSON.stringify(subjectsArray)); // Simpan ikut user
        showNotification("Subject record removed.");
        renderSubjectsView();
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
    if (e.key === `${currentUser}_subjects`) {
        subjectsArray = JSON.parse(localStorage.getItem(`${currentUser}_subjects`)) || [];
        renderSubjectsView();
    }
});