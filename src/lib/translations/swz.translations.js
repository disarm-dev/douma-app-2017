import Base from './base.translations.js'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'inkhundla'
    return super.getTableData(responses, denominator, field_name)
  }
}
