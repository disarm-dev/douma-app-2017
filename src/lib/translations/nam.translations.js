import Base from './base.translations.js'

export default class extends Base {
  constructor(responses, options) {
    super(responses, options)
  }

  responses_count() {
    return this.responses.length
  }

  sprayed_count() {
    return this.responses.reduce((acc, response, index) => {
      let {form_data} = response
      if (form_data.sprayable == 'yes') {
        return acc += form_data.numbersprayed_ddt + form_data.numbersprayed_delta
      } else {
        return acc
      }
    }, 0)
  }

  unsprayed_count() {
    return this.responses.reduce((acc, response, index) => {
      // debugger
      let {form_data} = response
      if (form_data.sprayable == 'yes' && form_data.number_unsprayed) {
        return acc += form_data.number_unsprayed
      } else {
        return acc
      }
    }, 0)
  }

  sprayed_over_visited() {
    const visited = this.sprayed_count() + this.unsprayed_count()
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
