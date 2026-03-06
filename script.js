
// Store events in localStorage
const STORAGE_KEY = 'malibaEvents';
const ADMIN_STORAGE_KEY = 'adminLoggedIn';

// Sample events data
const sampleEvents = [
    {
        id: 1,
        title: 'Mathematics Olympiad',
        date: '2026-03-15',
        time: '09:00',
        location: 'Main Hall',
        category: 'academic',
        description: 'Annual mathematics competition for all students. Test your problem-solving skills against peers.'
    },
    {
        id: 2,
        title: 'Inter-House Sports Day',
        date: '2026-03-20',
        time: '08:00',
        location: 'Sports Complex',
        category: 'sports',
        description: 'A day of friendly competition between the four houses. Events include athletics, football, netball, and more.'
    },
    {
        id: 3,
        title: 'Cultural Festival',
        date: '2026-03-28',
        time: '14:00',
        location: 'School Grounds',
        category: 'cultural',
        description: 'Celebrate diversity through music, dance, drama, and cultural displays from around the world.'
    },
    {
        id: 4,
        title: 'Science Expo',
        date: '2026-04-05',
        time: '10:00',
        location: 'Science Block',
        category: 'academic',
        description: 'Students showcase their science projects and experiments. Interactive demonstrations and competitions.'
    },
    {
        id: 5,
        title: 'School Gala Dinner',
        date: '2026-04-12',
        time: '18:00',
        location: 'Dining Hall',
        category: 'social',
        description: 'Annual formal dinner to celebrate academic excellence and community achievements.'
    }
];

// INITIALIZATION

document.addEventListener('DOMContentLoaded', function() {
    // Initialize events from localStorage or use sample data
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEvents));
    }

    // Set up hamburger menu
    setupHamburgerMenu();

    // Load page-specific content
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('events.html') || currentPage === '/') {
        loadEvents();
    }
    
    if (currentPage.includes('admin.html')) {
        initializeAdmin();
    }
});


// HAMBURGER MENU

function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        });
    }
}

// EVENTS MANAGEMENT

function getEvents() {
    const events = localStorage.getItem(STORAGE_KEY);
    return events ? JSON.parse(events) : [];
}

function saveEvents(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function loadEvents(filter = 'all') {
    const events = getEvents();
    const eventsList = document.getElementById('eventsList');
    const eventsPreview = document.getElementById('eventsPreview');
    const noEvents = document.getElementById('noEvents');

    // Filter events
    let filteredEvents = events;
    if (filter !== 'all') {
        filteredEvents = events.filter(event => event.category === filter);
    }

    // For home page preview (show only 3 upcoming events)
    if (eventsPreview) {
        const upcomingEvents = filteredEvents.slice(0, 3);
        
        if (upcomingEvents.length === 0) {
            eventsPreview.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280;">No events at the moment.</p>';
        } else {
            eventsPreview.innerHTML = upcomingEvents.map(event => createEventCard(event)).join('');
        }
    };

    // For events page (show all filtered events)
    if (eventsList) {
        if (filteredEvents.length === 0) {
            eventsList.style.display = 'none';
            noEvents.style.display = 'block';
        } else {
            eventsList.style.display = 'grid';
            noEvents.style.display = 'none';
            eventsList.innerHTML = filteredEvents.map(event => createEventCard(event)).join('');
        }
    }
}

function createEventCard(event) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return `
        <div class="event-card">
            <div class="event-card-header">
                <span class="event-category">${event.category}</span>
                <h3>${event.title}</h3>
            </div>
            <div class="event-card-body">
                <div class="event-details">
                    <i class="fas fa-calendar"></i>
                    <span>${formattedDate}</span>
                </div>
                <div class="event-details">
                    <i class="fas fa-clock"></i>
                    <span>${event.time}</span>
                </div>
                <div class="event-details">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <p class="event-description">${event.description}</p>
            </div>
        </div>
    `;
}

function filterEvents(category) {
    // Update active filter button
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Load filtered events
    loadEvents(category);
}

// ADMIN PANEL


function initializeAdmin() {
    const isLoggedIn = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    
    if (isLoggedIn) {
        showAdminPanel();
        loadAdminEvents();
    }
}

function handleAdminLogin(event) {
    event.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    // Simple authentication (hardcoded for demo)
    if (username === 'admin' && password === '#@Ad242') {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        document.getElementById('loginForm').style.display = 'none';
        showAdminPanel();
        loadAdminEvents();
    } else {
        alert('Invalid credentials. Check your username and password and try again.');
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    alert('Logged out successfully!');
}

function showAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}

function handleAddEvent(event) {
    event.preventDefault();

    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value;
    const category = document.getElementById('eventCategory').value;
    const description = document.getElementById('eventDescription').value;

    if (!title || !date || !time || !location || !category || !description) {
        alert('Please fill in all fields');
        return;
    }

    const events = getEvents();
    const newEvent = {
        id: Math.max(...events.map(e => e.id), 0) + 1,
        title,
        date,
        time,
        location,
        category,
        description
    };

    events.push(newEvent);
    saveEvents(events);

    // Clear form
    document.querySelector('.form-section form').reset();

    // Reload admin events list
    loadAdminEvents();

    alert('Event added successfully!');
}

function loadAdminEvents() {
    const events = getEvents();
    const adminEventsList = document.getElementById('adminEventsList');

    if (events.length === 0) {
        adminEventsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No events yet. Add one to get started!</p>';
    } else {
        adminEventsList.innerHTML = events.map(event => `
            <div class="admin-event-item">
                <h4>${event.title}</h4>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Category:</strong> <span class="event-category">${event.category}</span></p>
                <p><strong>Description:</strong> ${event.description}</p>
                <div class="admin-event-actions">
                    <button class="btn btn-danger" onclick="deleteEvent(${event.id})">Delete Event</button>
                </div>
            </div>
        `).join('');
    }
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        let events = getEvents();
        events = events.filter(event => event.id !== eventId);
        saveEvents(events);
        loadAdminEvents();
        alert('Event deleted successfully!');
    }
}

// CONTACT FORM

function sendMail(event) {
    let templateParams = {
        name: document.getElementById("contactName").value,
        email: document.getElementById("contactEmail").value,
        phone: document.getElementById("contactPhone").value,
        subject: document.getElementById("contactSubject").value,
        message: document.getElementById("contactMessage").value
    }

    emailjs.send('service_v6qchlr', 'template_t3z9qmr', templateParams).then(alert('Message sent successfully!'), function(error) {
        alert('Message sent successfully!');
    }, (error) => {
        alert('Failed to send message. Please try again.');
        console.error('Error:', error);
    });
}
