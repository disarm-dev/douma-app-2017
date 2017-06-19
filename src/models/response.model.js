import uuid from 'uuid/v4'

import {ResponseSchema} from './response.schema'

export class Response {
  model;

  create({recorded_on, id, country, user, location_selection, location, form_data}) {

    this.model = {
      location_selection,
      location,
      form_data,
      country,
      user,

      userAgent: navigator.userAgent,
      recorded_on: recorded_on || new Date(),
      id: id || uuid(),
      synced: false,
    }

    this.validate(this.model)
    return this.model
  }

  validate(model) {
    const errors = ResponseSchema.errors(model)

    if (errors) {
      console.log(errors)
      throw new Error('ResponseSchema validation failed')

    }
  }
}
