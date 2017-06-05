import Base from './base.translations.js'

import Aggregations from '@/lib/aggregations/nam.aggregations'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'region'
    return super.getTableData(responses, denominator, field_name)
  }
}

