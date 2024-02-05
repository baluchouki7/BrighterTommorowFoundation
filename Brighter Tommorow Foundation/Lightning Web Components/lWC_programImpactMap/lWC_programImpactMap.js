import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import leaflet from '@salesforce/resourceUrl/leaflet';
import getProgramLocations from '@salesforce/apex/CL_programLocationController.getProgramLocations';

export default class LWC_programImpactMap extends LightningElement {
    @track map;

    connectedCallback() {
        this.loadLeaflet();
    }

    loadLeaflet() {
        Promise.all([
            loadScript(this, leaflet + '/leaflet.js'),
            loadStyle(this, leaflet + '/leaflet.css'),
        ])
        .then(() => {
            console.log(L);
            this.initializeMap();
        })
        .catch(error => {
            console.error('Error loading Leaflet', error);
        });
    }

    initializeMap() {
        const mapElement = this.template.querySelector('.impact-map');
        this.map = L.map(mapElement).setView([22.3511, 78.6677], 5);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© Brighter Tomorrow Foundation'
        }).addTo(this.map);
    
        this.fetchProgramLocations();
    }

    fetchProgramLocations() {
        // Use Apex to fetch program locations
        getProgramLocations()
            .then(locations => {
                this.addMarkersToMap(locations);
            })
            .catch(error => {
                console.error('Error fetching program locations', error);
            });
    }

    addMarkersToMap(locations) {
        locations.forEach(location => {
            const marker = L.marker([location.Location__Latitude__s, location.Location__Longitude__s]).addTo(this.map);
            marker.bindPopup(`<b>${location.Name}</b><br>${location.Address__c}<br>${location.Location__Latitude__s}, ${location.Location__Longitude__s}`);
        });
    }
}