import uuid from 'uuid/v4'
import which_polygon from 'which-polygon'
import moment from 'moment-mini'
import omit from 'lodash.omit'

import {ResponseSchema} from './response.schema'
import cache from 'config/cache'
import {get_planning_level_id_field, get_planning_level_name} from 'lib/geodata/spatial_hierarchy_helper'
import instance_decorator from 'lib/instance_data/decorators'

export class Response {
  model;

  defaults = {
    userAgent: navigator.userAgent,
    id: uuid(),
    recorded_on: new Date(),
    location: {
      coords: null,
      selection: null
    },
    form_data: null,
    synced: false,
    team_name: null
  }

  /**
   * Required options: username, instance_slug
   * @param options
   */
  constructor(options) {
    this.model = Object.assign(this.defaults, options)
    this.validate()
  }

  validate() {
    const errors = ResponseSchema.errors(this.model)

    if (errors) {
      throw new Error(`ResponseSchema validation failed: ${JSON.stringify(errors)}`)
    } else {
      return true
    }
  }

  update(options) {
    this.model = Object.assign(this.model, options)
    this.validate()
  }

  is_ready_to_send() {
    return (this.model.form_data !== null) && (this.model.location.coords !== null) && (this.model.location.selection !== null)
  }

  decorate_for_sending() { // TODO: @refac Rename to not conflict with 'decorators'
    if (!this.is_ready_to_send()) return false

    const decorated = omit(this.model, 'synced')
    console.log('🚨 TODO: Update record model use on server and everywhere else (e.g. aggregations and monitor)')
    decorated.country = decorated.instance_slug
    decorated.location_selection = decorated.location.selection

    return decorated
  }

}


export const decorate_responses_from_json = (json, instance_config) => {
  const responses = json.map(response => {
    response.week = moment(response.recorded_on).week()
    return response
  })

  // Run instance decorator on all responses
  const decorated_responses = instance_decorator(responses, instance_config)

  const responses_with_planning_target_area = get_polygon_for_responses(decorated_responses, instance_config)
  return responses_with_planning_target_area
}

function get_polygon_for_responses(responses, instance_config){
  const planning_level_id_field = get_planning_level_id_field()
  const planning_level_name = get_planning_level_name()
  const planning_target_areas = cache.geodata[planning_level_name]
  const query = which_polygon(planning_target_areas)

  const responses_with_planning_target_area = responses.map(response => {
    const response_point = [response.location.coords.longitude, response.location.coords.latitude]
    const found = query(response_point)
    if (found) {
      // TODO: @doc Explain what the 'planning_target_area' is
      response.planning_target_area = found[planning_level_id_field]
    } else {
      response.planning_target_area = null
    }
    return response
  })

  return responses_with_planning_target_area
}
