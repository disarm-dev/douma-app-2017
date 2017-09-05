import {get_all_records} from './remote'
import {create_records_local, get_records_local, create_record_local} from "./local"

// For dashboard
export async function get_records_from_remote() {
  // get them from remote
  const remote_responses = await get_all_records()

  // validate and report on errors
  const valid_responses = validate_responses(remote_responses)

  // decorate as needed (static/by-hand and decorations.json)
  const decorated_records = decorate_responses(validate_responses)

  // populate local DB
  await local.create_records(decorated_records)

  // return them
  return decorated_records
}



// For record_point
export async function sync_records(records_array) {
  // send them off to the remote
  // mark the sent ones as synced
  // update the local db with synced records
  // return synced records, then update store
}

export async function create_record(record) {
  await create_record_local(record)
}

export async function get_records() {
  const records = await get_records_local()
  return records
}
