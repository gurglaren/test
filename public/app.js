// Hämta och visa alla resor på startsidan
async function fetchTrips() {
    const response = await fetch('/api/trips');
    const trips = await response.json();
    const tripsList = document.getElementById('tripsList');
    tripsList.innerHTML = '';

    trips.forEach(trip => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${trip.name} - ${trip.destination}</h3>
            <p>Pris: ${trip.price} SEK</p>
            <p>Datum: ${trip.date}</p>
            <button onclick="goToBooking(${trip.id})">Boka</button>
        `;
        tripsList.appendChild(listItem);
    });
}

// Navigera till bokningssidan med resans ID
function goToBooking(tripId) {
    window.location.href = `/book.html?tripId=${tripId}`;
}

// Initial hämta resor vid sidladdning
fetchTrips();
