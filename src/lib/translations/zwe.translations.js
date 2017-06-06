import Base from './base.translations.js'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'region'
    return super.getTableData(responses, denominator, field_name)
  }

  getMapStyle(feature, layer) {
    let {sprayed} = feature.properties.form_data
    return {
      color: sprayed === '1' ? 'green' : 'orange',
      weight: 0.8
    }
  }

  getPopupDescription(layer) {
    let record = layer.feature.properties
    return `
      <p><b>Date:</b> ${record.recorded_on}</p>
      <p><b>Recorded by:</b> ${record.user}</p>
      <p><b>Sprayed:</b> ${record.form_data.sprayed === '1' ? 'yes' : 'no'}</p>
    `
  }
}
