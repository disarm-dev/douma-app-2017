import remote from './remote'

export {read_plan_current_network, create_plan_network}

async function read_plan_current_network() {
  return await remote.read_plan_current()
}

async function create_plan_network(plan){
  return await remote.create_plan(plan)
}