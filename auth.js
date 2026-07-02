// ================= DATA STATE STORAGE =================
let registeredUsers = [];

const DEFAULT_USERS = [
    { email: "student@uitm.edu.my", name: "Nurul Haffizah", password: "password123" }
];

document.addEventListener("DOMContentLoaded", () => {
    // Sync accounts with localStorage
    const storedUsers = localStorage.getItem("beginner_users");
    if (storedUsers) {
        registeredUsers = JSON.parse(storedUsers);
    } else {
        registeredUsers = [...DEFAULT_USERS];
        localStorage.setItem("beginner_users", JSON.stringify(registeredUsers));
    }

    // Force automatic dashboard redirect if session exists
    const activeSession = localStorage.getItem("beginner_activeSession");
    if (activeSession) {
        window.location.href = "dashboard.html";
    }
});

// Toggles display forms
window.toggleAuthTab = function(tab) {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    document.getElementById('authAlert').classList.add('d-none');

    if(tab === 'login') {
        tabLogin.className = "nav-link active";
        tabRegister.className = "nav-link text-secondary";
        loginForm.classList.remove('d-none');
        registerForm.classList.add('d-none');
    } else {
        tabRegister.className = "nav-link active";
        tabLogin.className = "nav-link text-secondary";
        registerForm.classList.remove('d-none');
        loginForm.classList.add('d-none');
    }
}

window.showAuthAlert = function(msg, isSuccess = false) {
    const alertBox = document.getElementById('authAlert');
    const alertText = document.getElementById('authAlertText');

    alertBox.className = "alert py-2 text-center";
    if (isSuccess) {
        alertBox.classList.add('alert-success');
    } else {
        alertBox.classList.add('alert-danger');
    }

    alertText.innerText = msg;
    alertBox.classList.remove('d-none');
}

window.handleLogin = function(event) {
    event.preventDefault();
    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value;

    const matchedUser = registeredUsers.find(user => user.email === emailInput);

    if (matchedUser) {
        if (matchedUser.password === passwordInput) {
            localStorage.setItem("beginner_activeSession", matchedUser.name);
            window.location.href = "dashboard.html";
        } else {
            showAuthAlert("Incorrect password. Please verify and try again.");
        }
    } else {
        showAuthAlert("Email not found. Go to 'Create Account' tab to register.");
    }
}

window.handleRegister = function(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const confirmPass = document.getElementById('regConfirmPassword').value;

    if (password.length < 6) {
        showAuthAlert("Error: Password must contain at least 6 characters.");
        return;
    }

    if (password !== confirmPass) {
        showAuthAlert("Error: Password credentials do not match.");
        return;
    }

    const exists = registeredUsers.some(user => user.email === email);
    if (exists) {
        showAuthAlert("Error: This student email has already been registered.");
        return;
    }

    const newAccount = { name, email, password };
    registeredUsers.push(newAccount);
    localStorage.setItem("beginner_users", JSON.stringify(registeredUsers));

    showAuthAlert("Account registered successfully! Redirecting you...", true);

    setTimeout(() => {
        document.getElementById('registerForm').reset();
        localStorage.setItem("beginner_activeSession", name);
        window.location.href = "dashboard.html";
    }, 1200);
}