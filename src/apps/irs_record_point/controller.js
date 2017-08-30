import {cloneDeep as clonedeep} from 'lodash'

import CONFIG from 'config/common'
import {create_records} from 'lib/remote/remote.records'

export const controller  = {
  async create_records() {
    const max_records_in_batch = CONFIG.remote.max_records_batch_size

    // Clone so we can easily splice. response_id ensures updating works
    const records_left = clonedeep(records)

    // Batch creating of records
    const results = {pass: [], fail: []}

    while (records_left.length > 0) {
      const records_batch = records_left.splice(0, max_records_in_batch)

      await create_records(records_batch)
        .then((passed_records) => {
          // Set synced status for successfully-synced records
          results.pass.push(passed_records)
        })
        .catch((failed_records) => {
          results.fail.push(failed_records)
        })
    }

    // Return the results array
    return results.pass
  }
}
