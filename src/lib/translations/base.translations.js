import Aggregations from '@/lib/aggregations/swz.aggregations'

export default class Translations {
  _getTableData(responses, denominator, field_name) {

    const areas = responses.reduce((result, r) => {
      if (!result.includes(r.form_data[field_name])) {
        result.push(r.form_data[field_name])
      }
      return result
    }, [])


    const responses_sorted_by_area = areas.map((area) => {
      const filtered_responses = responses.filter((response) => response.form_data[field_name] === area)
      const aggregation_names = Object.keys(Aggregations)

      const row = aggregation_names.reduce((result, aggregation_name) => {
        const aggregation = Aggregations[aggregation_name]
        result[aggregation_name] = aggregation(filtered_responses, denominator)
        return result
      }, {village_name: area})

      return row

    })

    return responses_sorted_by_area
  }
}
