const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = 'apikey=XtC3y6Uo8LjeL5IgPrEWm8kRqzY7kR3p';
const classificationsArray = [];
async function fetchEvents() {
    const url = `${BASE_URL}/events.json?${API_KEY}`;
    onFetchStart()

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
    } finally {
        onFetchEnd();
    }
}

fetchEvents();

async function fetchAllClassifications() {
    const url = `${BASE_URL}/classifications.json?${API_KEY}`;
    const local = localStorage.getItem('data');

    if (local) {
        const retrievedObject = JSON.parse(local);
        const localType = retrievedObject._embedded.classifications;
        const localCName = localType.forEach((one) => {
            if(one.segment){
                const actualClassifications = one.segment.name;
                classificationsArray.push(actualClassifications);
                return actualClassifications;
            }
        })
        return;
    };

    try {
        const response = await fetch(url);
        const data = await response.json();
        localStorage.setItem('data', JSON.stringify(data));
        const type = data._embedded.classifications;
        const cName = type.forEach((one) => {
            if(one.segment){
                const actualClassifications = one.segment.name;
                classificationsArray.push(actualClassifications);
                return actualClassifications;
            }
        })
    } catch (error) {
        console.error(error)
    }
}

async function prefetchList() {
    try {
    const classifications = await fetchAllClassifications();
    $('.classification-count').text(`(${ classificationsArray.length })`);

    classificationsArray.forEach(classification => {
        const optionElement = $(`<option value='${classification}'>${classification}</option>`)
        $('#select-classification').append(optionElement)
      });

    } catch (error) {
      console.error(error);
    }
  }

  prefetchList();

  function buildSearchString() {
      const classValue = $('#select-classification').val();
      const keyValue = $('#keywords').val();

      const url = `${BASE_URL}/events.json?classificationName=${classValue}&keyword=${keyValue}&${API_KEY}`
      const encodedUrl = encodeURI(url);
      return encodedUrl;
  }

  buildSearchString();

$('#search').on('submit', async function (event) {
    event.preventDefault();
    try {
        const response = await fetch(buildSearchString());
        const data = await response.json();

        const events = data._embedded.events;
        console.log("EVENTS", events);

        updatePreview(events);

    
    } catch (error) {
        console.error(error);
    }
});

function renderPreview(event) {
    const { dates, id, images, info, name, _embedded } = event;
    const firstImage = event.images[0].url;
    const venue = event._embedded.venues[0].name;

    const newElem = $(`
        <div class="event-preview">
            <a href="#">
                <img src="${firstImage}" width="300" height="300"/>
                <h3>${venue}</h3>
            </a>
        </div>
    `);
    newElem.data('event', event);

    return newElem;
}

function updatePreview(events) {
    const root = $('#preview');
    const results = root.find('.results');
    results.empty();

    events.forEach((theEvent) => {
        results.append(renderPreview(theEvent));
    });
}



function onFetchStart() {
    $('#loading').addClass('active');
}

function onFetchEnd() {
    $('#loading').removeClass('active');
}