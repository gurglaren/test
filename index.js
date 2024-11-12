const express = require('express');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const usersFilePath = './data/users.json';
const tripsFilePath = './data/trips.json';
const bookingsFilePath = './data/resande.json';

// Läser resedata
function readTripsData() {
    return JSON.parse(fs.readFileSync(tripsFilePath, 'utf-8'));
}

// Skriver resedata
function writeTripsData(data) {
    fs.writeFileSync(tripsFilePath, JSON.stringify(data, null, 2));
}

// Läser bokningsdata
function readBookingsData() {
    try {
        const data = fs.readFileSync(bookingsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading bookings data:', error);
        return [];
    }
}

// Skriver bokningsdata
function writeBookingsData(data) {
    try {
        fs.writeFileSync(bookingsFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing bookings data:', error);
    }
}

// Hämta alla resor
app.get('/api/trips', (req, res) => {
    const trips = readTripsData();
    res.json(trips);
});

// Hämta en specifik resa
app.get('/api/trips/:id', (req, res) => {
    const trips = readTripsData();
    const trip = trips.find(t => t.id === parseInt(req.params.id));
    if (trip) {
        res.json(trip);
    } else {
        res.status(404).json({ message: 'Resa hittades inte' });
    }
});

// Bokning av en resa
app.post('/api/book', (req, res) => {
    const { tripId, userName } = req.body;

    if (!tripId || !userName) {
        return res.status(400).json({ message: 'Felaktig inmatning' });
    }

    let bookings = readBookingsData();
    const newBooking = {
        tripId: parseInt(tripId),
        userName: userName.trim()
    };

    bookings.push(newBooking);
    writeBookingsData(bookings);

    res.status(200).json({ message: 'Bokning bekräftad!' });
});

// Lägg till en ny resa (endast för admin)
app.post('/api/trips', (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, destination, price, date } = req.body; 
    const trips = readTripsData();

    const newTrip = {
        id: Date.now(),
        name,
        destination,
        price,
        date
    };

    trips.push(newTrip);
    writeTripsData(trips);

    res.json({ message: 'Resan har lagts till!' });
});

// Kontrollera sessionsstatus för admin
app.get('/api/check-session', (req, res) => {
    if (req.session.isLoggedIn) {
        res.status(200).json({ loggedIn: true });
    } else {
        res.status(401).json({ loggedIn: false });
    }
});

// Inloggningsrouta
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.isLoggedIn = true;
        req.session.username = username; 
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Utloggningsrouta
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' });
        }
        res.status(200).json({ message: 'Logged out' });
    });
});

// Starta servern
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// Ny routa för att hämta alla bokningar
app.get('/api/bookings', (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const trips = readTripsData();
    const bookings = readBookingsData();

    // Kombinera bokningar med resedetaljer
    const detailedBookings = bookings.map(booking => {
        const trip = trips.find(t => t.id === booking.tripId);
        return {
            userName: booking.userName,
            trip: trip ? {
                id: trip.id,
                name: trip.name,
                destination: trip.destination,
                date: trip.date
            } : null
        };
    }).filter(booking => booking.trip !== null); // Filtrera bort bokningar där resan inte finns

    res.json(detailedBookings);
});

