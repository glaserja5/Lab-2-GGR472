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

console.log("✅ Map initialized successfully!");

map.on("load", () => {
    console.log("✅ Map loaded, adding bike lanes...");

    // Load bike lane data from an external file
    fetch("data/cycling-network-4326.geojson")
        .then(response => response.json())
        .then(data => {
            console.log("✅ Bike lane GeoJSON loaded:", data);

            // Add the GeoJSON source
            map.addSource("bike-lanes", {
                type: "geojson",
                data: data
            });

            console.log("✅ Bike lane source added!");
        })
        .catch(error => console.error("❌ Error loading bike lanes:", error));
});
