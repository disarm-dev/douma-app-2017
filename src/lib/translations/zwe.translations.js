import Base from './base.translations.js'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'region'
    return super.getTableData(responses, denominator, field_name)
  }

  getMapStyle() {
    return {
      'circle-color': {
        property: 'sprayable',
        type: 'categorical',
        stops: [
          ['yes', '#22ff31'],
          ['no', '#f51506']
        ]
      }
    }
    let {sprayed} = feature.properties.form_data
    return {
      color: sprayed === '1' ? 'green' : 'orange',
      weight: 0.8
    }
  }

  getPopupDescription(feature) {
    let record = feature.properties
    return `
      <p><b>Date:</b> ${record.recorded_on}</p>
      <p><b>Recorded by:</b> ${record.user}</p>
      <p><b>Sprayable:</b> ${record.sprayable}</p>
    `
  }
}
