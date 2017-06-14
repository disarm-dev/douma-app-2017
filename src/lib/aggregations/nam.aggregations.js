import numeral from 'numeral'

function percentage(value) {
  return numeral(value).format('0.[0]%')
}

export default {

  'homesteads found': (responses, denominator) => {
    return responses.length
  },

  'structures found': (responses, denominator) =>  {
    return responses.reduce((sum, {form_data}) => {
      if (form_data.sprayable === 'yes') {
        return sum + form_data.number_sprayable + form_data.number_unsprayable
      }
      return sum
    }, 0)
  },

  'structures found %': (responses, denominator) => {
    let structures_found = responses.reduce((sum, {form_data}) => {
      if (form_data.sprayable === 'yes') {
        return sum + form_data.number_sprayable + form_data.number_unsprayable
      }
      return sum
    }, 0)
    console.warn('🏠 Using households instead of structures for denominator')
    return percentage(structures_found / denominator.number_of_households)
  },

  "structures sprayed": (responses, denominator) => {
    return responses.reduce((sum, {form_data}) => {
      if (form_data.sprayable === 'yes') {
        return sum + form_data.numbersprayed_delta + form_data.numbersprayed_ddt
      }
      return sum
    }, 0)
  },

  'structures sprayed %': (responses, denominator) => {
    let structures_sprayed = responses.reduce((sum, {form_data}) => {
      if (form_data.sprayable === 'yes') {
        return sum + form_data.numbersprayed_delta + form_data.numbersprayed_ddt
      }
      return sum
    }, 0)
    console.warn('🏠 Using households instead of structures for denominator')
    return percentage(structures_sprayed / denominator.number_of_households)
  },

  'sprayable structures not sprayed': (responses, denominator) =>  {
    return responses.reduce((sum, {form_data}) => {
      if (form_data.sprayable === 'yes') {
        return sum + (form_data.number_sprayable - (form_data.numbersprayed_delta + form_data.numbersprayed_ddt))
      }
      return sum
    }, 0)
  },

  'sprayable structures not sprayed (refused)': (responses, denominator) =>  {
    return responses.reduce((sum, {form_data}) => {
      if (!form_data.hasOwnProperty('reasons_notspraying')) return sum

      if(form_data.reasons_notspraying.includes('refused')) {
        return sum + (form_data.number_sprayable - (form_data.numbersprayed_delta + form_data.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)
  },

  'sprayable structures not sprayed (refused) %': (responses, denominator) => {
    let sprayable_not_sprayed = responses.reduce((sum, {form_data}) => {
      if (!form_data.hasOwnProperty('reasons_notspraying')) return sum

      if(form_data.reasons_notspraying.includes('refused')) {
        return sum + (form_data.number_sprayable - (form_data.numbersprayed_delta + form_data.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)
    return percentage(sprayable_not_sprayed / responses.length)
  },

  'sprayable structures not sprayed(other reason)': (responses, denominator) => {
    return responses.reduce((sum, {form_data}) => {
      if (!form_data.hasOwnProperty('reasons_notspraying')) return sum

      if(!form_data.reasons_notspraying.includes('refused')) {
        return sum + (form_data.number_sprayable - (form_data.numbersprayed_delta + form_data.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)
  },

  'sprayable structures not sprayed (other reason) %': (responses, denominator) => {
    let not_sprayed = responses.reduce((sum, {form_data}) => {
      if (!form_data.hasOwnProperty('reasons_notspraying')) return sum
        
      if(!form_data.reasons_notspraying.includes('refused')) {
        return sum + (form_data.number_sprayable - (form_data.numbersprayed_delta + form_data.numbersprayed_ddt))
      } else {
        return sum
      }
    }, 0)

    return percentage(not_sprayed / responses.length)
  }

}

