import schema from 'js-schema'

import {LocationSchema} from './location.schema'

export const ResponseSchema = schema({
  user: String,
  userAgent: String,
  country: String,
  id: String,
  recorded_on: [String, Date],
  form_data: Object,
  location: LocationSchema,  
  location_selection: { 
    name: String,
    id: [String, Number]
  }
})

