import Base from './base.translations.js'

export default class extends Base {
  getTableData(responses, denominator) {
    const field_name = 'inkhundla' // TODO: @refac Get this from the instance_config
    return this._getTableData(responses, denominator, field_name)
  }
}
