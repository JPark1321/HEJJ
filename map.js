const seattleLocations = [
    {
        name: "Papa Juans Downtown",
        address: "610 5th Avenue, Seattle, WA 98104",
        phone: "(206) 625-5011",
        lat: 47.6040,
        lng: -122.3307,
        hours: {
            "Monday": "24 hours",
            "Tuesday": "24 hours",
            "Wednesday": "24 hours",
            "Thursday": "24 hours",
            "Friday": "24 hours",
            "Saturday": "24 hours",
            "Sunday": "24 hours"
        },
        // This is what the location actually is
        actual: "Seattle Police Department Headquarters"
    },
    {
        name: "Papa Juans North",
        address: "10049 College Way N, Seattle, WA 98133",
        phone: "(206) 684-0850",
        lat: 47.7011,
        lng: -122.3343,
        hours: {
            "Monday": "24 hours",
            "Tuesday": "24 hours",
            "Wednesday": "24 hours",
            "Thursday": "24 hours",
            "Friday": "24 hours",
            "Saturday": "24 hours",
            "Sunday": "24 hours"
        },
        actual: "Seattle Police North Precinct"
    },
    {
        name: "Papa Juans East",
        address: "1519 12th Ave, Seattle, WA 98122",
        phone: "(206) 684-4300",
        lat: 47.6145,
        lng: -122.3167,
        hours: {
            "Monday": "24 hours",
            "Tuesday": "24 hours",
            "Wednesday": "24 hours",
            "Thursday": "24 hours",
            "Friday": "24 hours",
            "Saturday": "24 hours",
            "Sunday": "24 hours"
        },
        actual: "Seattle Police East Precinct"
    },
    {
        name: "Papa Juans South",
        address: "3001 S Myrtle St, Seattle, WA 98108",
        phone: "(206) 386-1850",
        lat: 47.5392,
        lng: -122.2977,
        hours: {
            "Monday": "24 hours",
            "Tuesday": "24 hours",
            "Wednesday": "24 hours",
            "Thursday": "24 hours",
            "Friday": "24 hours",
            "Saturday": "24 hours",
            "Sunday": "24 hours"
        },
        actual: "Seattle Police South Precinct"
    },
    {
        name: "Papa Juans Southwest",
        address: "2300 SW Webster St, Seattle, WA 98106",
        phone: "(206) 733-9800",
        lat: 47.5344,
        lng: -122.3603,
        hours: {
            "Monday": "24 hours",
            "Tuesday": "24 hours",
            "Wednesday": "24 hours",
            "Thursday": "24 hours",
            "Friday": "24 hours",
            "Saturday": "24 hours",
            "Sunday": "24 hours"
        },
        actual: "Seattle Police Southwest Precinct"
    },
    {
        name: "Papa Juans Broadview",
        address: "PO Box 31209, Seattle, WA 98103",
        phone: "(206) 299-2500",
        lat: 47.6734,
        lng: -122.3556,
        hours: {
            "Monday": "24 hours",
            "Tuesday": "24 hours",
            "Wednesday": "24 hours",
            "Thursday": "24 hours",
            "Friday": "24 hours",
            "Saturday": "24 hours",
            "Sunday": "24 hours"
        },
        actual: "Broadview Emergency Shelter"
    },
    {
        name: "Papa Juans New Beginnings",
        address: "PO Box 75125, Seattle, WA 98175",
        phone: "(206) 783-4520",
        lat: 47.6850,
        lng: -122.3412,
        hours: {
            "Monday": "24 hours",
            "Tuesday": "24 hours",
            "Wednesday": "24 hours",
            "Thursday": "24 hours",
            "Friday": "24 hours",
            "Saturday": "24 hours",
            "Sunday": "24 hours"
        },
        actual: "New Beginnings Domestic Violence Shelter"
    },
    {
        name: "Papa Juans Salvation Army",
        address: "Seattle, WA",
        phone: "(206) 324-4943",
        lat: 47.6042,
        lng: -122.3210,
        hours: {
            "Monday": "8:00 AM - 4:30 PM",
            "Tuesday": "8:00 AM - 4:30 PM",
            "Wednesday": "8:00 AM - 4:30 PM",
            "Thursday": "8:00 AM - 4:30 PM",
            "Friday": "8:00 AM - 4:30 PM",
            "Saturday": "Closed",
            "Sunday": "Closed"
        },
        actual: "Salvation Army Domestic Violence Programs"
    }
];

const fallbackLocation = {
    lat: 47.6520, 
    lng: -122.3124,
    name: "University of Washington Health Sciences Life Science Building",
    address: "1959 NE Pacific Street, Seattle, WA 98195"
};

let map;
let markers = [];
let infoWindow;
let userLocation = null;

// Load Google Maps when the DOM is ready
function loadGoogleMaps() {
    // Only load if we're on the about us page with the map
    if (document.getElementById('map')) {
        // Add CSS styles for the map
        addMapStyles();
        
        // Load Google Maps API script dynamically with required libraries
        const script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDtmOrI1PEZ8wWslrMQ6HMg5bqplun36XI&libraries=places,geometry&callback=initMap";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
        // Fallback if API key is not provided
        script.onerror = function() {
            console.log("Error loading Google Maps API. Please check your API key.");
            initMapFallback();
        };
    }
}

// Add CSS styles for the map and location list
function addMapStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #location-container {
            display: flex;
            flex-direction: row;
            width: 100%;
            gap: 20px;
        }
        
        #location-list-container {
            flex: 1;
            max-width: 350px;
        }
        
        #location-list {
            height: 300px; /* Default height, will be used if JavaScript fails */
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        #map-container {
            flex: 2;
        }
        
        #map {
            width: 100%;
            height: 100%,
            border: 1px solid #ddd;
            border-radius: 4px;
            position: relative;
        }
        
        .location-item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .location-item:hover {
            background-color: #f5f5f5;
        }
        
        .location-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .location-address, .location-phone, .location-distance {
            font-size: 14px;
            color: #555;
            margin-bottom: 3px;
        }
        
        .location-distance {
            color: #007bff;
            font-weight: 500;
        }
        
        .search-box {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        
        .search-box input {
            width: 70%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        
        .search-box button {
            padding: 8px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .search-box button:hover {
            background-color: #0056b3;
        }
        
        .info-window {
            max-width: 300px;
            padding: 0; /* Changed from 5px to 0 to remove the gap */
        }
        
        .info-window h3 {
            margin-top: 0;
            margin-bottom: 8px;
            padding-top: 10px; /* Add padding to the top of the heading instead */
            padding-left: 10px; /* Add padding to the sides */
            padding-right: 10px;
        }
        
        .info-window div {
            padding-left: 10px; /* Add padding to content divs */
            padding-right: 10px;
        }
        
        .hours-table {
            margin-top: 8px;
            font-size: 13px;
            padding-left: 10px;
            padding-right: 10px;
        }
        
        .hours-table td:first-child {
            padding-right: 10px;
            font-weight: 500;
        }
        
        #loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        #loading-message {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
}

// Initialize the map
function initMap() {
    // Create a default map centered at UW Health Sciences
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: fallbackLocation, // Initially center on UW Health Sciences
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });
    
    infoWindow = new google.maps.InfoWindow();
    
    // Show loading indicator
    showLoadingOverlay("Finding your location...");
    
    // Try to get the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // Success - user allowed location access
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Center map on user's location
                map.setCenter(userLocation);
                map.setZoom(13);
                
                // Find all locations near the user
                findNearbyLocations();
                
                // Hide loading indicator
                hideLoadingOverlay();
            },
            error => {
                // Error or user denied location access
                console.warn("Geolocation error:", error);
                handleLocationError(true);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // 10 second timeout
                maximumAge: 0 // Don't use cached position
            }
        );
    } else {
        // Browser doesn't support geolocation
        handleLocationError(false);
    }
    
    // Set up the search button
    const searchButton = document.getElementById("search-button");
    if (searchButton) {
        searchButton.addEventListener("click", searchLocations);
    }
    
    // Set up address input for "Enter" key press
    const addressInput = document.getElementById("address-input");
    if (addressInput) {
        addressInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                searchLocations();
            }
        });
    }
}

// Show loading overlay on the map
function showLoadingOverlay(message) {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;
    
    // Create loading overlay if it doesn't exist
    let overlay = document.getElementById("loading-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "loading-overlay";
        overlay.innerHTML = `<div id="loading-message"><p><strong>${message}</strong></p></div>`;
        mapElement.appendChild(overlay);
    } else {
        // Update existing overlay message
        document.getElementById("loading-message").innerHTML = `<p><strong>${message}</strong></p>`;
        overlay.style.display = "flex";
    }
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

// Handle geolocation errors
function handleLocationError(browserHasGeolocation) {
    hideLoadingOverlay();
    
    const errorMessage = browserHasGeolocation
        ? "Error: The Geolocation service failed or was denied."
        : "Error: Your browser doesn't support geolocation.";
    
    // Show alert to user
    // alert(errorMessage);
    
    // Use UW Health Sciences as fallback
    userLocation = fallbackLocation;
    
    // Center map on UW Health Sciences
    map.setCenter(fallbackLocation);
    
    // Find all locations near UW
    findNearbyLocations();
}

// Find and show locations near a point
function findNearbyLocations() {
    if (!map || !google || !userLocation) return;
    
    // Clear existing markers except user location marker
    clearMarkers();
    
    // Define a search radius - for example, 5 miles
    const searchRadius = 5; // in miles
    
    // Filter locations by distance
    const nearbyLocations = seattleLocations.filter(location => {
        // Calculate distance from user location
        const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            location.lat, location.lng
        );
        
        // Add distance to location object
        location.distance = distance;
        
        // Only include locations within the search radius
        return distance <= searchRadius;
    });
    
    // Add markers for nearby locations
    nearbyLocations.forEach(location => {
        addMarker(location);
    });
    
    // Sort locations by distance
    const sortedLocations = [...nearbyLocations].sort((a, b) => a.distance - b.distance);
    
    // Populate the location list with sorted locations
    populateLocationList(sortedLocations);
    
    // Adjust map bounds to fit all markers
    fitMapBounds();
    
    // If no locations found within radius, notify the user
    if (nearbyLocations.length === 0) {
        alert(`No locations found within ${searchRadius} miles of your search. Showing all locations instead.`);
        
        // If no nearby locations, show all locations as fallback
        seattleLocations.forEach(location => {
            // Calculate distance from user location
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                location.lat, location.lng
            );
            
            // Add distance to location object
            location.distance = distance;
            
            // Add marker
            addMarker(location);
        });
        
        // Sort all locations by distance
        const allSortedLocations = [...seattleLocations].sort((a, b) => a.distance - b.distance);
        
        // Populate the location list with all sorted locations
        populateLocationList(allSortedLocations);
        
        // Adjust map bounds to fit all markers
        fitMapBounds();
    }
}

// Calculate the distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d * 0.621371; // Convert to miles
}

// Search for locations near an address
function searchLocations() {
    const addressInput = document.getElementById("address-input");
    if (!addressInput) return;
    
    const addressValue = addressInput.value.trim();
    
    if (!addressValue) {
        alert("Please enter an address or zip code");
        return;
    }
    
    if (!map || !google) {
        alert("Map is not available at the moment. Please try again later.");
        return;
    }
    
    // Show loading message
    showLoadingOverlay(`Searching near: ${addressValue}`);
    
    // Use Geocoding API to convert address to coordinates
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addressValue + ", Seattle, WA" }, (results, status) => {
        if (status === 'OK' && results[0]) {
            // Get coordinates from first result
            userLocation = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };
            
            // Center map on search location
            map.setCenter(userLocation);
            map.setZoom(13);

            // Find locations near the searched address
            findNearbyLocations();

            // Hide loading message
            hideLoadingOverlay();
        } else {
            // Handle geocoding error
            hideLoadingOverlay();
            alert("Couldn't find that address. Please try a different search term.");
        }
    });
}

// Add a marker for a location
function addMarker(location) {
    if (!map || !google) return; // Guard clause if map isn't ready
    
    const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
        }
    });
    
    // Store the location data with the marker for easy access
    marker.locationData = location;
    
    markers.push(marker);
    
    // Add click event for the marker
    marker.addListener("click", () => {
        showInfoWindow(location, marker);
    });
}

// Clear all markers from the map (except user location marker)
function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
}

// Show info window for a location
// Show info window for a location
function showInfoWindow(location, marker) {
    if (!map || !google || !infoWindow || !userLocation) return;
    
    // Format distance
    const distanceText = location.distance 
        ? `${location.distance.toFixed(1)} miles away` 
        : "";
    
    // Create the content for the info window with proper spacing
    const content = `
        <div class="info-window">
            <h3>${location.name}</h3>
            <div>${location.address}</div>
            <div>${location.phone}</div>
            ${distanceText ? `<div><strong>${distanceText}</strong></div>` : ""}
            <div>${location.actual}</div>
        </div>
    `;
    
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}

// Populate the location list with sorted locations
function populateLocationList(locations) {
    const locationList = document.getElementById("location-list");
    if (!locationList) return;
    
    locationList.innerHTML = "";
    
    if (!locations || locations.length === 0) {
        locationList.innerHTML = "<div class='location-item'>No locations found</div>";
        return;
    }
    
    locations.forEach(location => {
        const locationItem = document.createElement("div");
        locationItem.className = "location-item";
        
        const distanceText = location.distance !== undefined
            ? `<div class="location-distance">${location.distance.toFixed(1)} miles away</div>`
            : "";
        
        locationItem.innerHTML = `
            <div class="location-name">${location.name}</div>
            <div class="location-address">${location.address}</div>
            <div class="location-phone">${location.phone}</div>
            ${distanceText}
        `;
        
        locationItem.addEventListener("click", () => {
            if (map && google) {
                // Find the corresponding marker
                const marker = markers.find(m => 
                    m.position.lat() === location.lat && 
                    m.position.lng() === location.lng
                );
                
                if (marker) {
                    // Center the map on this location
                    map.setCenter({ lat: location.lat, lng: location.lng });
                    map.setZoom(15);
                    
                    // Show the info window
                    showInfoWindow(location, marker);
                }
            }
        });
        
        locationList.appendChild(locationItem);
    });
}

// Fit map bounds to include all markers and user location
function fitMapBounds() {
    if (!map || !google || markers.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    
    // Include user location in bounds
    if (userLocation) {
        bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng));
    }
    
    // Include all location markers in bounds
    markers.forEach(marker => {
        bounds.extend(marker.getPosition());
    });
    
    // Fit map to bounds
    map.fitBounds(bounds);
    
    // If bounds are too small, set a minimum zoom
    const listener = google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom() > 15) {
            map.setZoom(15);
        }
        google.maps.event.removeListener(listener);
    });
}

// Fallback function if Google Maps API fails to load
function initMapFallback() {
    // Create a simple mock implementation
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; color: #666; text-align: center; padding: 20px;">
                <div>
                    <p><strong>Map loading failed</strong></p>
                    <p>We're unable to load the map at this time. Please check your internet connection or try again later.</p>
                </div>
            </div>
        `;
    }
    
    // Still populate the location list with all Seattle locations
    populateLocationList(seattleLocations);
    
    // Set up the search button with a simple alert
    const searchButton = document.getElementById("search-button");
    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const addressInput = document.getElementById("address-input");
            if (addressInput && addressInput.value.trim()) {
                alert(`Map is unavailable. Cannot search for locations near: ${addressInput.value}`);
            } else {
                alert("Please enter an address or zip code");
            }
        });
    }
}

// Make functions available globally
window.initMap = initMap;
window.initMapFallback = initMapFallback;

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', loadGoogleMaps);
