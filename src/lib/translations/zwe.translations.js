import Base from './base.translations.js'

export default class extends Base {

  sprayed_count() {
    return this.responses.reduce((acc, response, index) => {
      let {form_data} = response
      if (form_data.sprayed == '1') {
        return acc += 1
      } else {
        return acc
      }
    }, 0)
  }

  unsprayed_count() {
    return this.responses.reduce((acc, response, index) => {
      let {form_data} = response
      // TODO: @refac Keep '3' or partially sprayed here?
      if (form_data.sprayed == '2' || form_data.sprayed == '3') {
        return acc += 1
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
