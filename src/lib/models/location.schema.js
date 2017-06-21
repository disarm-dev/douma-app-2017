import schema from 'js-schema'


export const LocationSchema = schema({
  coords: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  } 
})
