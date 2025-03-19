const map = L.map('map').setView([55.67, 12.56], 12);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var myIcon = L.icon({
    iconUrl: './static/icons/pin.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [32, 16]
});

fetch('./static/js/data.json')
    .then(response => response.json())
    .then(data => {
        const markersData = data;
        var markers = [];
        var ul = document.getElementById('links');
        ul.classList.add("map-link");

        markersData.forEach(function(markerData, index) {
            var marker = L.marker([markerData.lat, markerData.lng], {icon: myIcon, title: `${markerData.name}` }).addTo(map);
            var authorsList = markerData.authors.join(', ');

            marker.bindPopup(`<img src="${markerData.image}" alt="${markerData.name}"> ${markerData.name} - ${authorsList}`, {maxWidth: 800, closeButton: false});
            markers.push({marker: marker, name: markerData.name, index: index});

            var link = document.createElement('a');
            var pin = document.createElement('img');
            var offset;

//            if (window.mobileCheck) {
//                offset = [0, -window.innerHeight * 0.1];
//            } else {
//                offset = [0, -window.innerHeight * 0.33];
//            }

            pin.classList.add('link-pin');
            pin.setAttribute('src', './static/icons/pin.svg');

            link.href = '#';
            link.textContent = `${markerData.name}`;
            link.addEventListener('click', function() {
                marker.openPopup();
                map.flyTo([markerData.lat, markerData.lng], 16, {
                    animate: true,
                    duration: 1.0
                });
            });

            var listItem = document.createElement('li');
            listItem.appendChild(link);
            ul.appendChild(listItem);
        });
    });
