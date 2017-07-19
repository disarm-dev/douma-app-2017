import schema from 'js-schema'

import {LocationSchema} from './location.schema'

export const ResponseSchema = schema({
  // Pass in
  username: String,
  instance_slug: String,

  // Set in constructor
  userAgent: String,
  id: String,
  recorded_on: [String, Date],

  // Pieces you can edit
  form_data: [Object, null],
  location:  {
    coords: [{
      latitude: Number,
      longitude: Number,
      accuracy: Number
    }, null],
    selection: [{
      id: [Number, String],
      name: String
    }, null]
  }
})
