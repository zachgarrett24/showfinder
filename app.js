const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = 'apikey=XtC3y6Uo8LjeL5IgPrEWm8kRqzY7kR3p';

function fetchEvents() {
    const url = `${BASE_URL}/events.json?countryCode=US&${API_KEY}`;

    fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.error(error);
        });
}

fetchEvents();