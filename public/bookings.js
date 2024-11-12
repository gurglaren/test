// Hämta och visa alla bokningar
async function fetchBookings() {
    try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
            const bookings = await response.json();
            const bookingsContainer = document.getElementById('bookingsContainer');
            bookingsContainer.innerHTML = '';

            // Gruppera bokningar efter resa
            const bookingsByTrip = {};
            bookings.forEach(booking => {
                if (!bookingsByTrip[booking.trip.id]) {
                    bookingsByTrip[booking.trip.id] = {
                        trip: booking.trip,
                        travelers: []
                    };
                }
                bookingsByTrip[booking.trip.id].travelers.push(booking.userName);
            });

            // Visa bokningar per resa
            for (const tripId in bookingsByTrip) {
                const tripInfo = bookingsByTrip[tripId].trip;
                const travelers = bookingsByTrip[tripId].travelers;

                // Skapa rubrik för resan
                const tripTitle = document.createElement('h2');
                tripTitle.textContent = `${tripInfo.name} - ${tripInfo.destination} (${tripInfo.date})`;
                bookingsContainer.appendChild(tripTitle);

                // Lista alla som bokat sig på denna resa
                if (travelers.length > 0) {
                    const travelerList = document.createElement('ul');
                    travelers.forEach(traveler => {
                        const listItem = document.createElement('li');
                        listItem.textContent = traveler;
                        travelerList.appendChild(listItem);
                    });
                    bookingsContainer.appendChild(travelerList);
                } else {
                    const noTravelersMessage = document.createElement('p');
                    noTravelersMessage.textContent = 'Inga bokningar ännu.';
                    bookingsContainer.appendChild(noTravelersMessage);
                }
            }
        } else {
            throw new Error('Kunde inte hämta bokningarna.');
        }
    } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Det gick inte att hämta bokningarna. Försök igen senare.');
    }
}

// Navigera tillbaka till admin-sidan
function goBack() {
    window.location.href = '/admin.html';
}

// Hämta bokningarna vid sidladdning
fetchBookings();
