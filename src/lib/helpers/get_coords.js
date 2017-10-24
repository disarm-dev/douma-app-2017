export async function get_current_coordinates(success, fail) {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 2000
  }
  navigator.geolocation.getCurrentPosition(success, fail, options)
}