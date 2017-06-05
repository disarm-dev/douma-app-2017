import Base from './base.translations.js'

import Aggregations from '@/lib/aggregations/bwa.aggregations'

export default class extends Base {
  getTableData(responses, denominator) {
    
    let areas = responses.reduce((result, r) => {
      if (!result.includes(r.form_data.village_chobe)) {
        result.push(r.form_data.village_chobe)
      }
      return result
    }, [])

    
    let responses_sorted_by_area = areas.map((area) => {
      let filtered_responses = responses.filter((response) => response.form_data.village_chobe === area)
      let aggregation_names = Object.keys(Aggregations)

      let row = aggregation_names.reduce((result, aggregation_name) => {
        let aggregation = Aggregations[aggregation_name]
        result[aggregation_name] = aggregation(filtered_responses, denominator)
        return result
      }, {village_name: area})

      return row

    })

    return responses_sorted_by_area
  }
}