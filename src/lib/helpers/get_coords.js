export async function get_current_coordinates(success_cb, fail_cb) {
  let watch_id
  const positions_found = []

  function check_if_return() {
    if (positions_found.length === 3) {
      decide_what_to_return(positions_found, success_cb, fail_cb)
      navigator.geolocation.clearWatch(watch_id);
    }

  }

  watch_id = navigator.geolocation.watchPosition(
    (position) => {
      console.log('position', position)
      positions_found.push(position)

      if (positions_found.length === 3) {
        decide_what_to_return(positions_found, success_cb, fail_cb)
        navigator.geolocation.clearWatch(watch_id);
      }
    },
    (error) => {
      console.log('error', error)
      positions_found.push(error)

      if (positions_found.length === 3) {
        decide_what_to_return(positions_found, success_cb, fail_cb)
        navigator.geolocation.clearWatch(watch_id);
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 2000
    }
  )
}

function decide_what_to_return(position_list, success_cb, fail_cb) {
  let thing_to_return

  position_list.forEach(item => {
    if (item.hasOwnProperty('coords')) {
      if (!thing_to_return) {
        thing_to_return = item
      } else if (item.coords.accuracy < thing_to_return.coords.accuracy) {
        thing_to_return = item
      }
    }
  })

  if (thing_to_return) {
    success_cb(thing_to_return)
  } else {
    const length = position_list.breakLength
    fail_cb(position_list[length - 1])
  }
}