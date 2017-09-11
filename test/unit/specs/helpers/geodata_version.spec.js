import {check_version} from "lib/models/geodata/geodata.versions"

describe('geodata version ', () => {
  it('returns false if no version in cache', () => {
    const local_version = null
    const required_version = 1

    const result = check_version(local_version, required_version)

    assert.isFalse(result)
  })
})
