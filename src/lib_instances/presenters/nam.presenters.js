import Base from './base.presenters.js'

import Aggregations from 'lib_instances/aggregations/nam.aggregations'

export default class extends Base {

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
  }

  getPopupDescription(feature) {
    let record = feature.properties
    return `
      <p><b>Date:</b> ${record.recorded_on}</p>
      <p><b>Recorded by:</b> ${record.user}</p>
      <p><b>Sprayable:</b> ${record.sprayable}</p>
      <p><b>Team leader:</b> ${record.team_leader}\n</p>
    `
  }
}

