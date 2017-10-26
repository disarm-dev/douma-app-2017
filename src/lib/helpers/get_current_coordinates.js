function watch_positions_for(duration_ms , options) {
  return new Promise((resolve) => {
    let watch_id
    const result = {
      errors: [],
      positions: []
    }

    setTimeout(() => {
      navigator.geolocation.clearWatch(watch_id)
      resolve(result)
    }, duration_ms)

    watch_id = navigator.geolocation.watchPosition((position) => {
      result.positions.push(position)
    },
    (error) => {
      result.errors.push(error)
    },
    options
    )
  })
}

export async function get_current_coordinates() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 2000
  }

  const {errors, positions} = await watch_positions_for(5000, options)
  return determine_response(positions, errors)
}

export async function determine_response(positions, errors) {
  if (positions.length > 0) {
    // If we have more than one position then return the position with the lowest accuracy value (the most accurate position).
    const position_with_highest_accuracy = positions.reduce((highest_accuracy, position) => {
      if (position.coords.accuracy < highest_accuracy.coords.accuracy) {
        highest_accuracy = position
      }
      return highest_accuracy
    })

    return position_with_highest_accuracy
  } else {
    // Else throw the latest error.
    const latest_error = errors[errors.length - 1]
    throw latest_error
  }
}