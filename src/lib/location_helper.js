import objectify from 'geoposition-to-object'


function geolocation_api_present() {
  return "geolocation" in navigator
}

function get_current_position() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve(objectify(position))
    }, (error) => reject(error))
  })
}

function watch_location() {}

export {geolocation_api_present, get_current_position, watch_location}
