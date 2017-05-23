import Base from './base.translations.js'

export default class extends Base {

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
    const targeted_count = this.options.targeted_count
    let percentage = (this.sprayed_count() / targeted_count) * 100
    return percentage
  }

}

// Output from elements_array:
// "sprayable"
// "number_sprayable"
// "number_unsprayable"
// "numbersprayed_ddt"
// "numbersprayed_delta"
// "sprayable_unsprayed"
// "number_unsprayed"
// "reasons_notspraying"
// "Unsprayable_reason"
// "house_population"
// "total_population_sprayedrooms"
// "region"
// "district"
// "village"
// "team_leader"
// "name_household"
// "health_number"
// "confirm"
// "number_bednets"

