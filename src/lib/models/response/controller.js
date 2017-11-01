import remote from './remote'
import Local from './local'
import instance_decorator from 'lib/models/response/decorators-evaluated'
import {store} from 'apps/store'

export class ResponseController {
  constructor(applet_name) {
    this.local = new Local(applet_name)
    this.remote = remote
  }

  async read_all_network() {
    // get them from remote
    const remote_responses = await this.remote.read_all()

    // const responses = decorate_responses_from_json(res, context.rootState.instance_config)

    const decorated_responses = instance_decorator(remote_responses, store.state.instance_config)

    // validate and report on errors
    // const valid_responses = validate_responses(remote_responses)

    // decorate as needed (static/by-hand and decorations.json)
    // const decorated_records = decorate_responses(validate_responses)

    // Clear local DB, so data is not stale
    await this.local.remove_all()

    // populate local DB
    await this.local.create_bulk(decorated_responses)

    // return them
    return remote_responses
  }


  async read_all_cache() {
    return await this.local.read_all()
  }


  async create_batch_network(responses) {
    return await this.remote.create(responses)
  }
}



