// Map functionality for Campus Connect

class CampusMap {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.map = null;
        this.markers = [];
        this.options = {
            center: [-26.2041, 28.0473], // Johannesburg coordinates
            zoom: 13,
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (!this.container || typeof L === 'undefined') return;
        
        this.map = L.map(this.container).setView(
            this.options.center, 
            this.options.zoom
        );
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);
        
        this.addDefaultMarkers();
    }
    
    addDefaultMarkers() {
        const locations = [
            {
                position: [-26.2041, 28.0473],
                title: 'Main Campus - Johannesburg',
                description: 'Student Hub, Parktown'
            },
            {
                position: [-33.9249, 18.4241],
                title: 'Cape Town Campus',
                description: 'Learning Centre, Gardens'
            },
            {
                position: [-29.8587, 31.0218],
                title: 'Durban Campus',
                description: 'Innovation Center, Berea'
            }
        ];
        
        locations.forEach(location => {
            this.addMarker(
                location.position,
                location.title,
                location.description
            );
        });
    }
    
    addMarker(position, title, description) {
        const marker = L.marker(position).addTo(this.map);
        
        const popupContent = `
            <div class="map-popup">
                <h4>${title}</h4>
                <p>${description}</p>
                <button class="btn btn-small" onclick="CampusMap.navigateToLocation(${position[0]}, ${position[1]})">
                    Get Directions
                </button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        this.markers.push(marker);
        
        return marker;
    }
    
    static navigateToLocation(lat, lng) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    }
    
    fitBounds() {
        if (this.markers.length === 0) return;
        
        const group = new L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Initialize maps when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const mapContainers = document.querySelectorAll('.map-container');
    
    mapContainers.forEach(container => {
        const mapId = container.id;
        if (mapId) {
            new CampusMap(mapId);
        }
    });
});