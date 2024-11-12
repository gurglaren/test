// Kontrollera om användaren är inloggad
async function checkLoginStatus() {
    const addTripSection = document.getElementById('addTrip');
    const loginSection = document.getElementById('loginSection');

    // Om användaren är inloggad, visa avsnittet för att lägga till resor
    if (await isLoggedIn()) {
        addTripSection.style.display = 'block';
        loginSection.style.display = 'none';
    } else {
        addTripSection.style.display = 'none';
        loginSection.style.display = 'block';
    }
}

// Kontrollera om användaren är inloggad
async function isLoggedIn() {
    const response = await fetch('/api/trips', { method: 'GET' });
    return response.status !== 401;
}

// Inloggningsfunktion
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert('Login successful');
        checkLoginStatus();
    } else {
        alert('Invalid credentials');
    }
}

// Utloggningsfunktion
async function logout() {
    await fetch('/logout', { method: 'POST' });
    alert('Logout successful');
    checkLoginStatus();
}

// Add a new trip
async function addTrip() {
    const name = document.getElementById('tripName').value;
    const destination = document.getElementById('destination').value;
    const price = document.getElementById('price').value;

    const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, destination, price })
    });

    if (response.ok) {
        fetchTrips();
    } else {
        alert('You need to be logged in to add a trip.');
    }
}

// Initial load of trips
fetchTrips();
checkLoginStatus();
