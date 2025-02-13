// Set your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiZ2xhc2VyamEiLCJhIjoiY201b2RybzhxMGt5ZDJrcTFoYWhuZGg1NSJ9.26_93f6771_YWY9BhIhnlw";

// Initialize the Mapbox map
const map = new mapboxgl.Map({
    container: "my-map", // Must match the ID in index.html
    style: "mapbox://styles/glaserja/cm72c3cvb007u01s31k928na5", // Your custom Mapbox Studio style
    center: [-79.39, 43.66], // Toronto coordinates
    zoom: 12
});

// Add navigation controls (zoom and rotation)
map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
    map.addSource('bike-routes', {
        type: 'geojson',
        data: 'https://glaserja5.github.io/Lab-2-GGR472/data/map.geojson'
    });

    map.addSource('toronto-crash-data', {
        type: 'vector',
        url: 'mapbox://glaserja.2xncd4nw'

    });

    map.addLayer({
        id: 'toronto-crash-data',
        type: 'circle',
        source: 'toronto-crash-data',
        paint: {
            "circle-radius": 5,
            "circle-color": "#ff0000"
        }
    })
})
