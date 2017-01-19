import Leaflet from 'leaflet'

// Read more: https://www.w3.org/TR/2016/REC-geolocation-API-20161108/

export default class LeafletGPS {
  _lmap = null
  _watchId = null
  _accuracyLabel = null
  _marker = null
  _fixedCenter = null
  
  accuracy = null
  position = null


  constructor(leafletMap) {
    // grab the map
    this._lmap = leafletMap

    this._fixedCenter = false

    if ('geolocation' in navigator) {

      // set up a watcher
      this._watchID = navigator.geolocation.watchPosition((position) => {
        this._onLocationFound({
          latlng: Leaflet.latLng(position.coords.latitude, position.coords.longitude), 
          accuracy: position.coords.accuracy
        })
      }, e => console.log(e), {enableHighAccuracy: true}); // maybe set highAccuracy dynamically, performance trade-off

      this._accuracyLabel = Leaflet.control.attribution({
        prefix: ``,
        position: 'topright'
      }).addTo(this._lmap)
      
      // Add a button to move map to center or let user control center of map
      const controlCenterButton  = L.Control.extend({
        options: {
          position: 'bottomright'
        },
        onAdd: (map) => {
          var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

          container.style.backgroundColor = 'red';
          container.style.width = '50px';
          container.style.height = '50px';
       
          container.onclick = () => {
            this._fixedCenter = !this._fixedCenter
            container.style.backgroundColor = this._fixedCenter ? 'red' : 'green';
          }
          return container;
        }
      })

      this._lmap.addControl(new controlCenterButton());

    } else {
      alert('GPS is not supported')
    }
  }

  _onLocationFound({latlng, accuracy}) {
    // expose these 
    this.accuracy = Math.round(accuracy * 100)/100; // round to two decimals
    this.position = latlng

    this._accuracyLabel.setPrefix(`<p style="font-size:20px;margin:0;">Accuracy: ${accuracy}m</p>`)
    
    // Move the map to the location, if center is fixed
    if (this._fixedCenter) {
      let zoom = this._lmap.getZoom() ? this._lmap.getZoom() : 17
      this._lmap.setView(latlng, zoom)  
    }
    

    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = Leaflet.marker(latlng).addTo(this._lmap)
    }

  }

  destroy() {
    if ("geolocation" in navigator) {
      navigator.geolocation.clearWatch(this._watchID);
    }
  }
}