import Base from './base.translations.js'

export default class extends Base {
  responses_count(responses) {
    return responses.length
  }

  sprayed_count(responses) {
    return responses.reduce((acc, response, index) => {
      let {form_data} = response
      if (form_data.sprayable == 'yes') {
        let sprayed = form_data.ddt + form_data.deltamethrin
        acc += sprayed
        return acc
      } else {
        return acc
      }
    }, 0)
  }

  unsprayed_count(responses) {
    return responses.reduce((acc, response, index) => {
      let {form_data} = response
      if (form_data.sprayable == 'yes') {
        let unsprayed = form_data.number_unsprayed
        acc += unsprayed
        return acc
      } else {
        return acc
      }
    }, 0)
  }

  calculate_progress(responses) {
    let percentage = (this.sprayed_count(responses) / 125) * 100 
    return percentage + '%'
  }

  coverage_places_visited(responses) {
    const total = this.sprayed_count(responses) + this.unsprayed_count(responses)
    let percentage = (this.sprayed_count(responses) / total) * 100
    return percentage + '%'
  }

  // TODO: @refac Rename
  people_sprayed(responses) {
    return responses.reduce((acc, response, index) => {
      let {form_data} = response
      if (form_data.sprayable == 'yes') {
        let unsprayed = form_data.number_unsprayed
        acc += unsprayed
        return acc
      } else {
        return acc
      }
    }, 0)
  }
}
