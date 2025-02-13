// Set your Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiZ2xhc2VyamEiLCJhIjoiY201b2RybzhxMGt5ZDJrcTFoYWhuZGg1NSJ9.26_93f6771_YWY9BhIhnlw";

// Initialize the Mapbox map
const map = new mapboxgl.Map({
    container: "my-map",
    style: "mapbox://styles/glaserja/cm72c3cvb007u01s31k928na5",
    center: [-79.39, 43.66], // Toronto coordinates
    zoom: 12
});

// Add navigation controls (zoom and rotation)
map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
    console.log("✅ Map loaded!");

    // call bikeroute data
    map.addSource("bike-routes", {
        type: "geojson",
        data: "https://glaserja5.github.io/Lab-2-GGR472/data/bikeroutes.geojson"
    });

    // add tileset data source from mapbox
    map.addSource("toronto-crash-data", {
        type: "vector",
        url: "mapbox://glaserja.1s8ixfae" // calls tileset id from mapbox
    });

    // addlayer draws bike lanes onto the mapbox container
    map.addLayer({
        id: "bike-routes-layer",
        type: "line", // specify vector data as line
        source: "bike-routes",
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
            "line-color": "#007cbf", // Blue for bike lanes
            "line-width": 3
        }
    });

    console.log("✅ Bike routes added!"); // added console log functions after using chatGPT to troubleshoot "COR" errors

    // Load cyclist PNG icon from GitHub
    map.loadImage(
        "https://raw.githubusercontent.com/glaserja5/Lab-2-GGR472/main/bike-svgrepo-com.png", // calls png link from github
        (error, image) => {
            if (error) throw error;
            map.addImage("cyclist-icon", image); // Adds the image to Mapbox

            // add layer to draw collision points as bike icons
            map.addLayer({
                id: "toronto-crash-layer",
                type: "symbol", // Use "symbol" for icons so its compatible with image type
                source: "toronto-crash-data",
                "source-layer": "TOTAL_KSI_-443861647161779187-ade2h2", // references tileset layer name
                layout: {
                    "icon-image": "cyclist-icon", // Uses the cyclist icon
                    "icon-size": [
                        "interpolate", ["linear"], ["zoom"], // scales the bike icon to zoom distance so icons arent clumped
                        8, 0.01,  // At zoom level 10, icon size is 0.05 etc. 
                        10, 0.03,
                        12, 0.06,
                        14, 0.1,
                        16, 0.15,
                        18, 0.25
                    ],
                    "icon-allow-overlap": true // Prevents icons from hiding
                },
                filter: ["==", ["get", "CYCLIST"], "Yes"] // Show only cyclist crashes
            });

            console.log("✅ Cyclist crash icons added!");
        }
    );

    // Add popup on click for cyclist crash points
    map.on("click", "toronto-crash-layer", (e) => {
        const properties = e.features[0].properties;

        // Create popup content by showing properties name and assigning aliases to make readable
        // "unkown" will appear if data is empty 
        const popupContent = `//
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

    console.log("✅ Crash data popups added!");
});
