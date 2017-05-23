import numeral from 'numeral'

function percentage(value) {
  return numeral(value).format('0.[0]%')
}

export default {

  'homesteads found': (responses, denominator, results_so_far) => {
    return responses.length
  },

  'structures found': (responses, denominator, results_so_far) =>  {
    return responses.reduce((sum, r) => {
      return sum + r.number_sprayable + r.number_unsprayable
    }, 0)
  },

  'structures found %': (responses, denominator, results_so_far) => {
    return percentage(results_so_far['structures found'] / denominator.structures_targeted)
  },

  "structures sprayed": (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      return sum + r.numbersprayed_delta + r.numbersprayed_ddt
    }, 0)
  },

  'structures sprayed %': (responses, denominator, results_so_far) => {
    return percentage(results_so_far['structures sprayed'] / denominator.structures_targeted)
  },

  'sprayable structures not sprayed': (responses, denominator, results_so_far) =>  {
    return responses.reduce((sum, r) => {
      return sum + (r.number_sprayable - (r.numbersprayed_delta + r.numbersprayed_ddt))
    }, 0)
  },

  'sprayable structures not sprayed (refused)': (responses, denominator, results_so_far) =>  {
    return responses.reduce((sum, r) => {
      if(r.reasons_notspraying.includes('refused')) {
        return sum + (r.number_sprayable - (r.numbersprayed_delta + r.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)
  },

  'sprayable structures not sprayed (refused) %': (responses, denominator, results_so_far) => {
    return percentage(results_so_far['sprayable structures not sprayed (refused)'] / denominator.structures_found)
  },

  'sprayable structures not sprayed(other reason)': (responses, denominator, results_so_far) => {
    return responses.reduce((sum, r) => {
      if(!r.reasons_notspraying.includes('refused')) {
        return sum + (r.number_sprayable - (r.numbersprayed_delta + r.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)
  },

  'sprayable structures not sprayed (other reason) %': (responses, denominator, results_so_far) => {
    return percentage(results_so_far['sprayable structures not sprayed(other reason)'] / denominator.structures_found)
  }

}

