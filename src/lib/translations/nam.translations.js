import Base from './base.translations.js'

import Aggregations from '@/lib/aggregations/nam.aggregations'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'region'
    return super.getTableData(responses, denominator, field_name)
  }

  getMapStyle(feature, layer) {
    let {sprayable} = feature.properties.form_data
    return {
      color: sprayable === 'yes' ? 'green' : 'orange',
      weight: 0.8
    }
  }

  getPopupDescription(layer) {
    let record = layer.feature.properties
    return `
      <p><b>Date:</b> ${record.recorded_on}</p>
      <p><b>Recorded by:</b> ${record.user}</p>
      <p><b>Sprayable:</b> ${record.form_data.sprayable}</p>
      <p><b>Team leader:</b> ${record.form_data.team_leader}\n</p>
    `
  }
}

