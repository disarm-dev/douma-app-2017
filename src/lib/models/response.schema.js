import schema from 'js-schema'

export const CoordsSchema = schema({
  latitude: Number,
  longitude: Number,
  accuracy: Number
})

export const SelectionSchema = schema({
  // id is optional, as the custom text input only uses the name property
  // this is to distinguish between free text entry and something from location_selection
  '?id': [Number, String],
  name: String
})

export const ResponseSchema = schema({
  // passed-in, non-editable
  instance_slug: String,

  // generated, non-editable
  userAgent: String,
  id: String,

  // passed-in, editable
  username: String,
  team_name: [String, null],

  // generated, editable
  recorded_on: [String, Date],

  // user-generated, editable
  team_name: [String, null],
  form_data: [Object, null],
  location:  {
    coords: [CoordsSchema, null],
    selection: [SelectionSchema, null]
  }
})


