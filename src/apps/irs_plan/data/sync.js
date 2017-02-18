// Called by $store, coordinates local and remote activity
import LocalDB from '../../../lib/local.js'
import RemoteDBClass from '../../../lib/remote.js'

class Sync {

  config(team_id) {
    this.team_id = team_id
  }

  // Get all clusters
  get_localities() {
    const R_SERVER_URL = '' // TODO: @debug Point to a real R server
    const url = R_SERVER_URL + `/localities?country_code=`
    // return fetch()
    return new Promise((resolve, reject) => resolve('All good!'))
  }

}

export default new Sync()