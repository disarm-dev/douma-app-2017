import local from 'lib/models/response/local'

describe('Responses local', () => {
  describe('basic CRUD functions exist', () => {
    // responses/local.js
    // create
    // (read one) - we get single records from $store
    // read all
    // update
    // (delete) - not currently used, closely linked to `update`

    it('create, read_all and update all exist as functions', () => {
      const expected = 'function'

      assert.equal(typeof local.create, expected)
      assert.equal(typeof local.read_all, expected)
      assert.equal(typeof local.update, expected)
    })

  })


})