export default class Translations {
  responses_count(responses) {
    return responses.length
  }

  sprayed_count(responses) {
    return this.responses_count()
  }

  unsprayed_count(responses) {
    return this.responses_count()
  }

  calculate_progress(responses) {
    return this.responses_count()
  }
}