import Aggregations from 'lib/aggregations'

export default class Presenters {
  constructor(instance_config) {
    this.instance_config = instance_config
    this.slug = instance_config.slug
    this.aggregations = Aggregations[this.slug]
  }

  getMapData() {}

  getTableData({responses, denominators, instance_config}) {
    // Get id_field from instance_config
    let target_area_id_field
    const found = instance_config.spatial_hierarchy.find(h => h.hasOwnProperty('denominator'))
    if (found) {
      target_area_id_field = found.field_name
    } else {
      throw new Error('Cannot find denominator field_name on instance_config')
    }


    // Collect responses for each area, and calculate every aggregation for each
    const responses_grouped_by_area = denominators.map((area_denominator) => {
      const required_aggregations = ['structures sprayed', 'structures sprayed %']

      let denominator_row = {}
      denominator_row[target_area_id_field] = area_denominator.id // Set header for first column i.e. 'locality' or 'region'

      // Get the relevant responses for this area
      const area_responses = responses.filter((response) => response.location_selection.id === area_denominator.id)

      if (area_responses.length === 0)  return null

    // Iterate each required aggregation, calculate it and push into the row for this area
      required_aggregations.forEach(aggregation_name => {
        const aggregation = this.aggregations[aggregation_name]
        denominator_row[aggregation_name] = aggregation(area_responses, area_denominator)
      })

      return denominator_row
    })

    // Remove null, empty
    const flat_responses_grouped_by_area = responses_grouped_by_area.filter(r => r)

    return flat_responses_grouped_by_area
  }
}
