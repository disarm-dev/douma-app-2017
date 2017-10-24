function get_current_position_promise(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function watch_n_positions(n , options) {
  let watch_id
  const result = {
    errors: [],
    positions: []
  }

  return new Promise((resolve, reject) => {

    const check_if_done = () => {
      if ((result.errors.length + result.positions.length) === n) {
        navigator.geolocation.clearWatch(watch_id)
        resolve(result)
      }
    }

    watch_id = navigator.geolocation.watchPosition((position) => {
      console.log('position from watchPosition', position)
      result.positions.push(position)
      check_if_done()
    },
    (error) => {
      console.log('error from watchPosition', error)
      result.errors.push(error)
      check_if_done()
    },
    options
    )
  })
}

export async function get_current_coordinates(success_cb, fail_cb) {
  let errors = []
  let positions = []
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 2000
  }

  try {
    const position = await get_current_position_promise(options)
    console.log('position from getCurrentPosition', position)
    positions.push(position)
  } catch (error) {
    console.log('error from getCurrentPosition', error)
    errors.push(error)
  }

  const result_from_watch = await watch_n_positions(2, options)

  errors = errors.concat(result_from_watch.errors)
  positions = positions.concat(result_from_watch.positions)

  // If we have only one position after getting and watching then return that one position.
  if (positions.length == 1) {
    let single_position = positions[0]
    console.log('RESULT: single_position', single_position)
    return success_cb(single_position)
  }

  // If we have more than one position then return the position with the lowest accuracy value (the most accurate position).
  if (positions.length > 1) {
    let position_with_highest_accuracy = positions[0]

    positions.forEach(position => {
      if (position.coords.accuracy < position_with_highest_accuracy.coords.accuracy) {
        position_with_highest_accuracy = position
      }
    })
    console.log('RESULT: position_with_highest_accuracy', position_with_highest_accuracy)
    return success_cb(position_with_highest_accuracy)
  }

  // Else return the latest error.
  const number_of_errors = errors.length
  const latest_error = errors[number_of_errors - 1]
  console.log('RESULT: latest_error', latest_error)
  return fail_cb(latest_error)
}