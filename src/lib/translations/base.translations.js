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

  visited_count(responses) {

  }

  calculate_progress(responses) {
    return this.responses_count()
  }
}
