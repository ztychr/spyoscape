const map = L.map('map', {
/* attributionControl: false // disable default */
}).setView([55.67, 12.56], 12, animate=false);

/*
L.maplibreGL({
    style: 'https://tiles.openfreemap.org/styles/liberty',
}).addTo(map)

L.control.attribution({
  prefix: false,
}).addAttribution('© OpenStreetMap contributors').addTo(map);
*/

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/* Add togglable layers */
var marker_layer =  L.featureGroup();
var heatmap_layer =  L.featureGroup();
var cluster_layer = L.markerClusterGroup({
    animate: true,
    spiderfyOnMaxZoom: false,
    disableClusteringAtZoom: 16, // must be 16 or else image view will close under cluster view as it zooms out
//    maxClusterRadius: 150,
    maxClusterRadius: function (zoom) {
        return 120 - (zoom * 5);}
});

marker_layer.addTo(map);
// cluster_layer.addTo(map);
// heatmap_layer.addTo(map);  // Disabled by default. toggleable by user

/* Add the layer toggle menu in the top right corner */
var overlayMaps = {
    "Markers": marker_layer,
    "Heatmap": heatmap_layer,
    "Cluster": cluster_layer,
};

var layerControl = L.control.layers({},overlayMaps,{
    collapsed: false,
}).addTo(map);

/* Heatmap options */
const heatmap_intensity = 35;
const heatmap_radius = 15;

var markers = {};

var myIcon = L.icon({
    iconUrl: 'static/icons/pin.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

function focus_marker(marker, open=true) {
    var mapSize = map.getSize();
    var centerX = mapSize.x / 2;
    var centerY = mapSize.y * 0.9;
    var panX = centerX - mapSize.x / 2;
    var panY = centerY - mapSize.y / 2;
    // Fit image in view, using a hardcoded offset to fit image
    map.flyTo([marker._latlng.lat + panY * 0.000013, marker._latlng.lng], 16, {
        animate: true,
        duration: 1.0
    });

    if (open) {
        marker.openPopup();
    }
}

function onMapClick(e) {
    popup = L.popup();
    popup
        .setLatLng(e.latlng)
        .setContent(`${e.latlng["lat"].toFixed(6).toString()}, ${e.latlng["lng"].toFixed(6).toString()}`)
        .openOn(map);
    console.log(e.latlng["lat"]);
}

// map.on('click', onMapClick);

map.on('popupopen', function (e) {
    const popupEl = e.popup.getElement();
    if (popupEl) {
        const img = popupEl.querySelector('img');
        if (img) {
            setTimeout(function() {
            WZoom.create(img,
                         {
                             smoothTime: 0,
                             minScale: 1,
                             maxScale: 10,
                             onGrab: function () {
                                 img.style.cursor = 'grabbing';
                             },
                             onDrop: function () {
                                 img.style.cursor = 'grab';
                             },
                         }
                        );
                    }, 1000);
        }
    }
});

/*map.on('popupopen', function (e) {
    console.log('Popup opened:', e.popup);
    const img = e.popup.getElement().querySelector('img');
    if (img) {
        WZoom.create(img);
    }
});*/

fetch('static/js/data.json')
    .then(response => response.json())
    .then(data => {

        function click_marker(marker) {
             // Callback, when clicking a marker
             // Save work name in URL to allow linking to this work
             history.pushState({}, null, `#${marker.target.options.title}`);
             focus_marker(marker.target, open=false);
        }

        const markersData = data;
        console.log(markersData)
        var ul = document.getElementById('links');

        Object.entries(markersData).forEach(([name, markerData], index) => {
            var marker = L.marker([markerData.lat, markerData.lng], {icon: myIcon, title: `${name}` });
            marker.addTo(marker_layer).on('click', click_marker);
            marker.addTo(cluster_layer).on('click', click_marker);

            var authorsList = markerData.authors.join(', ');

            marker.bindPopup(`<img id="zoom-image-${index}" class="zoomable-img" src="${markerData.image}" alt="${name}"> ${name} - ${authorsList}`, {maxWidth: 800, closeButton: true});

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

                // Scroll map into view on list click, for phone view
                map._container.scrollIntoView()
            });

            var listItem = document.createElement('li');
            listItem.appendChild(link);
            ul.appendChild(listItem);
        });

        // Load image name from url (if relevant) and open it
        if (window.location.hash){
            focus_marker(markers[decodeURIComponent(window.location.hash.substring(1))].marker);
        }

        /* Heatmap */
        heatmap_layer.clearLayers();
        const artworks_heatmap_format = Object.values(markersData).map(r => [r.lat, r.lng, heatmap_intensity]);  // Convert data to heatmap format
        var heat = L.heatLayer(artworks_heatmap_format, {radius: heatmap_radius}).addTo(heatmap_layer);

    });

