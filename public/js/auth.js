async function register() {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

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
        window.location.href = "index.html"; // Redirect to the login page
    } else {
        alert(data.message); // Display any error messages from the server
    }
}


async function signIn() {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

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
        window.location.href = "main-page.html";
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
