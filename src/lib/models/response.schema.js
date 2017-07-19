import schema from 'js-schema'

import {LocationSchema} from './location.schema'

export const ResponseSchema = schema({
  // passed-in, non-editable
  instance_slug: String,

  // generated, non-editable
  userAgent: String,
  id: String,

  // passed-in, editable
  username: String,

  // generated, editable
  recorded_on: [String, Date],

  // user-generated, editable
  team_name: [String, null],
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
    }, null],
  },
})
