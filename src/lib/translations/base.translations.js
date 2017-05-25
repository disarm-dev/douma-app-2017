export default class Translations {
  constructor({records = [], options = {}}) {
    this.records = records
    this.options = options
  }

  records_count() {
    return this.records.length
  }
}
