import Base from './base.translations.js'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'village_chobe'
    return this._getTableData(responses, denominator, field_name)
  }
}
