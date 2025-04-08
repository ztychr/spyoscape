const map = L.map('map').setView([55.67, 12.56], 12, animate=false);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

 // Caclulate pixel offset to allow space enough for the image when opening marker, given the map pixel size
const mapSize = map.getSize();
const centerX = mapSize.x / 2;
const centerY = mapSize.y * 0.9;
const xOffset = centerX - mapSize.x / 2;
const yOffset = centerY - mapSize.y / 2;

var markers = {};

var myIcon = L.icon({
    iconUrl: 'static/icons/pin.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Function to calculate offset coordinates
function offsetLatLng(map, latlng, xOffset, yOffset) {
    // Convert the latlng to a point
    let point = map.latLngToContainerPoint(latlng);

    // Apply the offset
    point.x -= xOffset;
    point.y -= yOffset;

    // Convert the point back to latlng
    return map.containerPointToLatLng(point);
}


function focus_marker(marker, animate=true) {
    marker.openPopup();
    // Calculate offset coordinate to allow enough space for image
    let offsetLatLngTarget = offsetLatLng(map, marker._latlng, xOffset, yOffset);
    map.flyTo(offsetLatLngTarget, 16, {
        animate: animate,
        duration: 1.0
    });
}

fetch('static/js/data.json')
    .then(response => response.json())
    .then(data => {

        function click_marker(marker) {
             // Callback, when clicking a marker
             // Save work name in URL to allow linking to this work
             history.pushState({}, null, `#${marker.target.options.title}`);
        }


        const markersData = data;
        var ul = document.getElementById('links');

        Object.entries(markersData).forEach(([name, markerData], index) => {
            var marker = L.marker([markerData.lat, markerData.lng], {icon: myIcon, title: `${name}` }).addTo(map).on('click', click_marker);;
            var authorsList = markerData.authors.join(', ');

            marker.bindPopup(`<img src="${markerData.image}" alt="${name}"> ${name} - ${authorsList}`, {maxWidth: 800, closeButton: false});
            markers[name] = {marker: marker, index: index};

            var link = document.createElement('a');
            var pin = document.createElement('img');

            pin.classList.add('link-pin');
            pin.setAttribute('src', './static/icons/pin.svg');

            link.textContent = `${name}`;
            link.addEventListener('click', function(event) {
                focus_marker(marker, markerData);
                // Append open image name to url to allow user to link to a specific image
                history.pushState({}, null, `#${name}`);
            });

            var listItem = document.createElement('li');
            listItem.appendChild(link);
            ul.appendChild(listItem);
        });

        // Load image name from url (if relevant) and open it
        if (window.location.hash){
            focus_marker(markers[decodeURIComponent(window.location.hash.substring(1))].marker, animate=false);
            focus_marker(markers[decodeURIComponent(window.location.hash.substring(1))].marker, animate=true);
        }
    });

