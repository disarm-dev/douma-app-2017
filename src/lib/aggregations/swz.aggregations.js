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
      return sum + form_data.number_structures_total
    }, 0)
  },
  'structures found %': (responses, denominator) => {
    
    let structures_found_so_far = responses.reduce((sum, {form_data}) => {
      return sum + form_data.number_structures_total
    }, 0)

    return (structures_found_so_far / denominator.structures_targeted) * 100
  },
  "structures sprayed": (responses, denominator) => {
    return responses.reduce((sum, {form_data}) => {
      return sum + form_data.number_of_structures_sprayed
    }, 0)
  },
  'structures sprayed %': (responses, denominator) => {
    let structures_sprayed = responses.reduce((sum, {form_data}) => {
      return sum + form_data.number_of_structures_sprayed
    }, 0)

    return (structures_sprayed / denominator.structures_targeted) * 100
  },
  'sprayable structures not sprayed': (responses, denominator) =>  {
    return responses.reduce((sum, {form_data}) => {
      return sum + (form_data.number_structures_total - form_data.number_of_structures_sprayed)
    }, 0)
  }
}