import Base from './base.translations.js'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'village_chobe'
    return super.getTableData(responses, denominator, field_name)
  }

  getMapStyle(feature, layer) {
    let {any_sprayed} = feature.properties.form_data
    return {
      color: any_sprayed === 'yes' ? 'green' : 'orange',
      weight: 0.8
    }
  }

  getPopupDescription(layer) {
    let record = layer.feature.properties
    return `
      <p><b>Date:</b> ${record.recorded_on}</p>
      <p><b>Recorded by:</b> ${record.user}</p>
      <p><b>Sprayed:</b> ${record.form_data.any_sprayed}</p>
      <p><b>Number of people:</b> ${record.form_data.ppl_in_hs}\n</p>
    `
  }
}
