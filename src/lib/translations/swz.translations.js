import Base from './base.translations.js'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'inkhundla'
    return super.getTableData(responses, denominator, field_name)
  }

  getMapStyle() {
    return {
      'circle-color': {
        property: 'visit_type',
        type: 'categorical',
        stops: [
          ['first_visit', '#22ff31'],
          ['mopup', '#f51506']
        ]
      }
    }
  }

  getPopupDescription(feature) {
    let record = feature.properties
    return `
      <p><b>Date:</b> ${record.recorded_on}</p>
      <p><b>Recorded by:</b> ${record.user}</p>
      <p><b>Visit type:</b> ${record.visit_type}</p>
      <p><b>Number of structures:</b> ${record.number_structures_total}\n</p>
    `
  }
}
