
export async function get_records() {
  // get them from remote
  const remote_responses = await get_responses()

  // validate and report on errors
  const valid_responses = validate_responses(remote_responses)

  // decorate as needed (static/by-hand and decorations.json)
  const decorated_records = decorate_responses(validate_responses)

  // populate local DB
  await local.create_records(decorated_records)

  // return them
  return decorated_records
}

export function create_records(records_array) {}
