import remote from 'lib/models/response/remote'

describe('Responses remote', () => {
  describe('basic CRUD functions exist', () => {
    // responses/remote.js
    // create
    // (read one)
    // read all
    // (update)
    // (delete)

    it('create, read_all exist as functions', () => {
      const expected = 'function'
      assert.equal(typeof remote.create, expected)
      assert.equal(typeof remote.read_all, expected)
    })
  })
})