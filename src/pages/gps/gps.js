import Leaflet from 'leaflet'

// Read more: https://www.w3.org/TR/2016/REC-geolocation-API-20161108/

export default class LeafletGPS {
  _lmap = null
  _watchId = null
  _accuracyLabel = null
  _marker = null
  
  accuracy = null
  position = null


  constructor(leafletMap) {
    // grab the map
    this._lmap = leafletMap

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

    } else {
      alert('GPS is not supported')
    }
  }

  _onLocationFound({latlng, accuracy}) {
    // expose these 
    this.accuracy = accuracy
    this.position = latlng

    this._accuracyLabel.setPrefix(`<p style="font-size:20px;margin:0;">Accuracy: ${accuracy}m</p>`)
    
    let zoom = 17
    if(this._lmap.getZoom()) {
      zoom = this._lmap.getZoom()
    } 
    this._lmap.setView(latlng, zoom)

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