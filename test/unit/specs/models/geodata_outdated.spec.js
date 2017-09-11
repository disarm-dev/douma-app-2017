import {geodata_outdated} from "lib/models/geodata/geodata.valid"

describe('geodata outdated', () => {
  it('returns false if versions for all levels do not match required', () => {
    const geodata = {
      top: {
        _version: 1
      },
      bottom: {
        _version: 2
      }
    }

    const required_version = 1

    const result = geodata_outdated(geodata, required_version)

    assert.isFalse(result)

  })

  it('returns true if versions for all levels match required', () => {
    const geodata = {
      top: {
        _version: 1
      },
      bottom: {
        _version: 1
      }
    }

    const required_version = 1

    const result = geodata_outdated(geodata, required_version)

    assert.isTrue(result)
  })

  it('returns false if a version is missing', () => {
    const geodata = {
      top: {
      },
      bottom: {
        _version: 1
      }
    }

    const required_version = 1

    const result = geodata_outdated(geodata, required_version)

    assert.isFalse(result)
  })
})
