import Base from './base.translations.js'

export default class extends Base {
  constructor(responses, options) {
    super(responses, options)
  }

  sprayed_count() {
    return this.responses.reduce((acc, response, index) => {
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

  unsprayed_count() {
    return this.responses.reduce((acc, response, index) => {
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

  sprayed_over_visited() {
    const visited = this.sprayed_count() + this.unsprayed_count()
    return visited
    let percentage = (this.sprayed_count() / visited) * 100
    return percentage
  }

  sprayed_over_targeted() {
    // TODO: @debug Introduce error-checking in translations, esp. for missing properties
    const targeted = this.options.targeted
    let percentage = (this.sprayed_count() / targeted) * 100
    return percentage
  }

}
