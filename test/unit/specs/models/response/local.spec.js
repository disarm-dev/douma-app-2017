import local from 'lib/models/response/local'

describe('Responses local', () => {
  describe('basic CRUD functions exist', () => {
    // SIMPLE (proxied to responses.local.js)
    // * create - make new record from RECORD
    // * read all - view them all in MONITOR
    // * update - edit in RECORD
    // (delete) - not yet

    it('create, read all and update all exist as functions', () => {
      assert.isFunction(local.create)
      assert.isFunction(local.read_all)
      assert.isFunction(local.update)
    })

  })


})