import AllAggregations from '@/lib/aggregations'

export default class Translations {
  constructor(instance_config) {
    this.instance_config = instance_config
    this.slug = instance_config.slug
    this.aggregations = AllAggregations[this.slug]
  }

  getTableData(responses, denominator, field_name) {

    const areas = responses.reduce((result, r) => {
      if (!result.includes(r.form_data[field_name])) {
        result.push(r.form_data[field_name])
      }
      return result
    }, [])



    const responses_grouped_by_area = areas.map((area) => {
      const filtered_responses = responses.filter((response) => response.form_data[field_name] === area)
      const aggregation_names = Object.keys(this.aggregations)

      let first_column = {}
      first_column[field_name] = area

      const row = aggregation_names.reduce((result, aggregation_name) => {
        const aggregation = this.aggregations[aggregation_name]
        result[aggregation_name] = aggregation(filtered_responses, denominator)
        return result
      }, first_column)

      return row

    })

    return responses_grouped_by_area
  }
}
