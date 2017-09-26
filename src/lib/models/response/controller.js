import remote from './remote'
import Local from './local'

export class ResponsesController {
  constructor(applet_name) {
    this.local = new Local(applet_name)
  }

  async read_all_network() {
    // get them from remote
    const remote_responses = await remote.read_all()

    // const responses = decorate_responses_from_json(res, context.rootState.instance_config)
    //
    // const decorated_responses = instance_decorator(responses, context.rootState.instance_config)

    // validate and report on errors
    // const valid_responses = validate_responses(remote_responses)

    // decorate as needed (static/by-hand and decorations.json)
    // const decorated_records = decorate_responses(validate_responses)

    // Clear local DB, so data is not stale

    // populate local DB
    await local.create_bulk(remote_responses)

    // return them
    return remote_responses
  }


  async read_all_cache() {
    return await local.read_all()
  }


  async create_batch_network(responses) {
    return await remote.create(responses)
  }
}



