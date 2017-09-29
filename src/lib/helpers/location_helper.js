import objectify from 'geoposition-to-object'


export function get_current_position(options) {
  if (!"geolocation" in navigator) return

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      resolve(objectify(position))
    }, (error) => reject(error),
    options)
  })
}
