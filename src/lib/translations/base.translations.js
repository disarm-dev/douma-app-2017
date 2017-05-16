export default class Translations {
  constructor(responses, options) {
    this.responses = responses
    this.options = options
  }

  responses_count() {
    return this.responses.length
  }

  sprayed_count() {
    return 0
  }

  unsprayed_count() {
    return 0
  }

  sprayed_over_visited() {
    return 0
  }

  sprayed_over_targeted() {
    return 0
  }

}
