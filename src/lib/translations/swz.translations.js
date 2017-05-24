import Base from './base.translations.js'

export default class extends Base {

  operational_units(feature_collection) {

    feature_collection.features = feature_collection.features.map(ou => {
      return {
        type: ou.type,
        geometry: ou.geometry,
        properties: {
          ...ou.properties,
          name: `${ou.properties.Name1} ${ou.properties.Name2}`,
          id: ou.properties.UniqLocCod,
        }
      }
    })

    return feature_collection

  }

  sprayed_count() {
    return this.responses.reduce((acc, response, index) => {
      let {form_data} = response
      return acc += form_data.number_of_structures_sprayed
    }, 0)
  }

  unsprayed_count() {
    return this.responses.reduce((acc, response, index) => {
      let {form_data} = response
      return acc += form_data.number_of_structures_unsprayed
    }, 0)
  }

  sprayed_over_visited() {
    const visited = this.sprayed_count() + this.unsprayed_count()
    let percentage = (this.sprayed_count() / visited) * 100
    return percentage
  }

  sprayed_over_targeted() {
    // TODO: @debug Introduce error-checking in translations, esp. for missing properties
    const targeted = this.options.targeted_count
    let percentage = (this.sprayed_count() / targeted) * 100
    return percentage
  }

}
