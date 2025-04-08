const map = L.map('map').setView([55.67, 12.56], 12);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var myIcon = L.icon({
    iconUrl: 'static/icons/pin.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

fetch('static/js/data.json')
    .then(response => response.json())
    .then(data => {

        function focus_poi(marker) {
            marker.openPopup();
            map.flyTo([marker._latlng.lat, marker._latlng.lng], 16, {
                animate: true,
                duration: 1.0
            });
            //event.preventDefault();
            setTimeout(() => {
                map.panBy([panX, -panY], { animate: true, duration: 1.0 });
            }, 1500);
        }

        function click_marker(marker) {
             // Callback, when clicking a marker
             // Save work name in URL to allow linking to this work
             history.pushState({}, null, `#${marker.target.options.title}`);
        }


        const markersData = data;
        var markers = [];
        var ul = document.getElementById('links');
        var mapSize = map.getSize();
        var centerX = mapSize.x / 2;
        var centerY = mapSize.y * 0.9;
        var panX = centerX - mapSize.x / 2;
        var panY = centerY - mapSize.y / 2;

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
                focus_poi(marker, markerData);
                // Append open image name to url to allow user to link to a specific image
                history.pushState({}, null, `#${name}`);
            });

            var listItem = document.createElement('li');
            listItem.appendChild(link);
            ul.appendChild(listItem);
        });

        // Load image name from url (if relevant) and open it
        if (window.location.hash){
            focus_poi(markers[decodeURIComponent(window.location.hash.substring(1))].marker);
        }
    });

