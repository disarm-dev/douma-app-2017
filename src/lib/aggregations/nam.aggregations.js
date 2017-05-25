import numeral from 'numeral'

function percentage(value) {
  return numeral(value).format('0.[0]%')
}

export default {

  'homesteads found': (records, denominator, results_so_far) => {
    return records.length
  },

  'structures found': (records, denominator, results_so_far) =>  {
    return records.reduce((sum, r) => {
      return sum + r.number_sprayable + r.number_unsprayable
    }, 0)
  },

  'structures found %': (records, denominator, results_so_far) => {
    return percentage(results_so_far['structures found'] / denominator.structures_targeted)
  },

  "structures sprayed": (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      return sum + r.numbersprayed_delta + r.numbersprayed_ddt
    }, 0)
  },

  'structures sprayed %': (records, denominator, results_so_far) => {
    return percentage(results_so_far['structures sprayed'] / denominator.structures_targeted)
  },

  'sprayable structures not sprayed': (records, denominator, results_so_far) =>  {
    return records.reduce((sum, r) => {
      return sum + (r.number_sprayable - (r.numbersprayed_delta + r.numbersprayed_ddt))
    }, 0)
  },

  'sprayable structures not sprayed (refused)': (records, denominator, results_so_far) =>  {
    return records.reduce((sum, r) => {
      if(r.reasons_notspraying.includes('refused')) {
        return sum + (r.number_sprayable - (r.numbersprayed_delta + r.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)
  },

  'sprayable structures not sprayed (refused) %': (records, denominator, results_so_far) => {
    return percentage(results_so_far['sprayable structures not sprayed (refused)'] / denominator.structures_found)
  },

  'sprayable structures not sprayed(other reason)': (records, denominator, results_so_far) => {
    return records.reduce((sum, r) => {
      if(!r.reasons_notspraying.includes('refused')) {
        return sum + (r.number_sprayable - (r.numbersprayed_delta + r.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)
  },

  'sprayable structures not sprayed (other reason) %': (records, denominator, results_so_far) => {
    return percentage(results_so_far['sprayable structures not sprayed(other reason)'] / denominator.structures_found)
  }

}

