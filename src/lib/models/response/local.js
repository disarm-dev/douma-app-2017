// create local DB
// apply schema to local DB
// add version-migrations as required

// import {douma_db} from 'lib/local_dbs'


async function read_all() {
  // const responses = await douma_db.find({}).exec()
  //
  // return responses
}

async function create(responses) {
  // for (response of responses) {
  //   await douma_db.insert(response)
  // }
  // return true
}

export default {read_all, create}