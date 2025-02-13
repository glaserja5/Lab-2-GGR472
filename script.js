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
    console.log("✅ Map loaded!");

    // 🔹 ADD BIKE ROUTES FROM GEOJSON (Your GitHub File)
    map.addSource("bike-routes", {
        type: "geojson",
        data: "https://glaserja5.github.io/Lab-2-GGR472/data/map.geojson"
    });

    // 🔹 ADD FATAL COLLISION DATA FROM MAPBOX TILESET
    map.addSource("toronto-crash-data", {
        type: "vector",
        url: "mapbox://glaserja.1s8ixfae" // ✅ Make sure this is your actual tileset ID
    });

    // 🔹 DRAW BIKE ROUTES AS LINES
    map.addLayer({
        id: "bike-routes-layer",
        type: "line",
        source: "bike-routes",
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
            "line-color": "#007cbf", // 🔵 Blue for bike lanes
            "line-width": 3
        }
    });

    console.log("✅ Bike routes added!");

    // 🔹 DRAW FATAL COLLISION POINTS AS RED CIRCLES
    map.addLayer({
        id: "toronto-crash-layer",
        type: "circle",
        source: "toronto-crash-data",
        "source-layer": "TOTAL_KSI_-443861647161779187-ade2h2", // 🔥 Replace with actual tileset layer name
        paint: {
            "circle-radius": 3.5,
            "circle-color": "red"
        },
        filter: ["==", ["get", "CYCLIST"], "Yes"] // ✅ Show only cyclist crashes

    });

    // Add popup on click for cyclist crash points
map.on("click", "toronto-crash-layer", (e) => {
    const properties = e.features[0].properties;

    // Create popup content
    const popupContent = `
        <strong>Crash Summary</strong><br>
        <b>Location:</b> ${properties.ACCLOC || "Unknown"}<br>
        <b>Impact Type:</b> ${properties.IMPACTYPE || "Unknown"}<br>
        <b>Accident Class:</b> ${properties.ACCCLASS || "Unknown"}<br>
        <b>Date:</b> ${properties.DATE || "Unknown"}
    `;

    // Add popup to the map
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map);
});
    
    console.log("✅ Crash data added!");
});
