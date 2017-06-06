import Base from './base.translations.js'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'inkhundla'
    return super.getTableData(responses, denominator, field_name)
  }

  getMapStyle(feature, layer) {
    let {visit_type} = feature.properties.form_data
    return {
      color: visit_type === 'first_visit' ? 'green' : 'orange',
    }
  }

  getPopupDescription(layer) {
    let record = layer.feature.properties
    return `
      <p><b>Date:</b> ${record.recorded_on}</p>
      <p><b>Recorded by:</b> ${record.user}</p>
      <p><b>Visit type:</b> ${record.form_data.visit_type}</p>
      <p><b>Number of structures:</b> ${record.form_data.number_structures_total}\n</p>
    `
  }
}
