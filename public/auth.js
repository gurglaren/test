// Kontrollera om admin är inloggad
async function checkAdminStatus() {
    const addTripSection = document.getElementById('addTripSection');
    const loginSection = document.getElementById('loginSection');

    if (await isLoggedIn()) {
        addTripSection.style.display = 'block';
        loginSection.style.display = 'none';
    } else {
        addTripSection.style.display = 'none';
        loginSection.style.display = 'block';
    }
}

// Kontrollera inloggningsstatus
async function isLoggedIn() {
    const response = await fetch('/api/check-session');
    return response.status === 200;
}

// Logga in-funktion
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert('Inloggning lyckades!');
        checkAdminStatus();
    } else {
        alert('Fel användarnamn eller lösenord');
    }
}

// Logga ut-funktion
async function logout() {
    await fetch('/logout', { method: 'POST' });
    alert('Du har loggats ut');
    checkAdminStatus();
}

// Lägg till resa
async function addTrip() {
    const name = document.getElementById('tripName').value;
    const destination = document.getElementById('destination').value;
    const price = document.getElementById('price').value;
    const date = document.getElementById('date').value;  // Hämta datumet

    const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, destination, price, date })
    });

    if (response.ok) {
        alert('Resa tillagd!');
    } else {
        alert('Endast inloggade admins kan lägga till resor');
    }
}

// Initial kontroll av adminstatus
checkAdminStatus();
