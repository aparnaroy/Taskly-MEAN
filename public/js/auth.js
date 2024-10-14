function redirectToLogin() {
    window.location.href = "login.html";
}

function redirectToRegister() {
    window.location.href = "register.html";
}

$(document).ready(function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            await signIn();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            await register();
        });
    }
});


async function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html"; // Redirect to the login page
    } else {
        alert(data.message); // Display any error messages from the server
    }
}

async function signIn() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        // Store user info
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('token', data.token);
        window.location.href = "main-page.html"; // Redirect to main app page
    } else {
        alert(data.message);
    }
}

async function signOut() {
    sessionStorage.clear();
    // Optionally call your logout API
    await fetch('http://localhost:3000/api/auth/logout', { method: 'POST' });
    window.location.href = "index.html";
}
