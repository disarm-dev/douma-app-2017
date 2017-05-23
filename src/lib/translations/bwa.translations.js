import Base from './base.translations.js'

export default class extends Base {
  
  operational_units(feature_collection) {

    feature_collection.features = feature_collection.features.map(ou => {
      return {
        type: ou.type,
        geometry: ou.geometry,
        properties: {
          name: `${ou.properties.Name}. ${ou.properties.VILLAGE}`,
          id: ou.properties.OBJECTID_1,
        }
      }
    })

    return feature_collection
    
  }

  sprayed_count() {
    return this.responses.reduce((acc, response, index) => {
      // debugger
      let {form_data} = response
      if (form_data.sprayed == 'yes' && form_data.were_spray_allrooms == 'yes') {
        return acc += form_data.number_sprayed_lambdacyhalothrin + form_data.number_sprayed_ddt
      } else if (form_data.sprayed == 'yes' && form_data.were_spray_allrooms == 'no') {
        return acc += form_data.number_sprayed
      } else {
        return acc
      }
    }, 0)
  }

  unsprayed_count() {
    return this.responses.reduce((acc, response, index) => {
      // debugger
      let {form_data} = response
      if (form_data.sprayed == 'no') {
        return acc += form_data.room_count
      } else if (form_data.sprayed == 'yes') {
        return acc += form_data.n_unsprayed
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
