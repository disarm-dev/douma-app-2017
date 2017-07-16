import {get_geodata} from './remote.get_geodata'
import {get_instance_files} from './remote.instance'
import {authenticate} from './remote.authenticate'
import {get_current_plan, create_plan} from './remote.plans'
import {get_all_records, create_records} from './remote.records'

export {
  // Meta
  get_geodata,
  get_instance_files,
  authenticate,

  // Plans
  get_current_plan,
  create_plan,

  // Records
  get_all_records,
  create_records
}

