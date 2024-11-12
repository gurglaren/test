// Hämta resans ID från URL
const urlParams = new URLSearchParams(window.location.search);
const tripId = urlParams.get('tripId');

// Hämta resans detaljer och visa dem
async function fetchTripDetails() {
    try {
        const response = await fetch(`/api/trips/${tripId}`);
        if (response.ok) {
            const trip = await response.json();
            document.getElementById('tripDetails').textContent = `${trip.name} - ${trip.destination}, ${trip.date} (${trip.price} SEK)`;
        } else {
            throw new Error('Kunde inte hämta resans detaljer.');
        }
    } catch (error) {
        console.error('Error fetching trip details:', error);
        alert('Det gick inte att hämta resans detaljer. Försök igen senare.');
    }
}

// Bekräfta bokning
async function confirmBooking() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    if (!firstName || !lastName) {
        alert('Vänligen fyll i både förnamn och efternamn.');
        return;
    }

    try {
        const response = await fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tripId, userName: `${firstName} ${lastName}` })
        });

        if (response.ok) {
            alert('Bokning bekräftad!');
            window.location.href = '/index.html'; // Tillbaka till startsidan
        } else {
            throw new Error('Bokningen kunde inte bekräftas.');
        }
    } catch (error) {
        console.error('Error confirming booking:', error);
        alert('Det gick inte att bekräfta bokningen. Försök igen senare.');
    }
}

// Hämta resans detaljer vid sidladdning
fetchTripDetails();
