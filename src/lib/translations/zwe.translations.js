import Base from './base.translations.js'

export default class extends Base {

  operational_units(feature_collection) {

    feature_collection.features = feature_collection.features.map(ou => {
      return {
        type: ou.type,
        geometry: ou.geometry,
        properties: {
          ...ou.properties,
          name: ou.properties.WARDPCODE,
          id: ou.properties.WARDPCODE,
        }
      }
    })

    return feature_collection
  }

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
    const targeted_count = this.options.targeted_count
    let percentage = (this.sprayed_count() / targeted_count) * 100
    return percentage
  }

}
