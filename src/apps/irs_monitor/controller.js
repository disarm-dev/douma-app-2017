import {get_all_records} from 'lib/remote/remote.records'
import {decorate_responses_from_json} from 'lib/models/response.model'

export const controller  = {
  async retrieve_from_remote(context) {

    // do remote request
    return get_all_records()
      .then(res=> {
        const responses = decorate_responses_from_json(res, context.rootState.instance_config)
        return responses
      })
    // handle errors
    // put results into local, persisted storage
    // return results to put $store.state -- only if not using RxDB or similar
  }
}
