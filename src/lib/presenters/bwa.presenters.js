import Base from './base.presenters.js'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'village_chobe'
    return super.getTableData(responses, denominator, field_name)
  }

  getMapStyle() {
     return {
      'circle-color': {
        property: 'any_sprayed',
        type: 'categorical',
        stops: [
          ['yes', 'green'],
          ['no', 'orange']
        ]
      }
    }
  }

  getPopupDescription(feature) {
    let record = feature.properties
    return `
      <p><b>Date:</b> ${record.recorded_on}</p>
      <p><b>Recorded by:</b> ${record.user}</p>
      <p><b>Sprayed:</b> ${record.any_sprayed}</p>
      <p><b>Number of people:</b> ${record.n_people_homestead}\n</p>
    `
  }
}
