export default class Translations {
  constructor({responses, options}) {
    this.responses = responses
    this.options = options
  }

  responses_count() {
    return this.responses.length
  }
}
