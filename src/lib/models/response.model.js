import uuid from 'uuid/v4'

import {ResponseSchema} from './response.schema'

export class Response {
  model;

  create({recorded_on, id, country, user, location_selection, location, form_data}) {

    if (recorded_on && !id) {
      throw new Error('Response is not valid. Recorded_on was passed but no id. Ensure both are either passed or not.')
    }

    if (!recorded_on && id) {
      throw new Error('Response is not valid. Id was passed but no recorded_on. Ensure both are either passed or not.')
    }

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
