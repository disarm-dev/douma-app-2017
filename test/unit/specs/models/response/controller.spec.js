import controller from 'lib/models/response/controller'

describe('responses.controller', () => {


  describe('WOVEN TOGETHER', () => {
    describe('"SYNC NEW RECORDS": get all new local records, write to remote (e.g. for RECORD)', () => {
      it('should be a function', () => {
        const expected = 'function'
        const actual = typeof controller.sync_new_records
        assert.equal(actual, expected)
      })
      
      it('throw error if given no responses', async () => {
        const expected = 'Need to pass more than zero responses'

        try {
          await controller.sync_new_records([])
        } catch(e) {
          const actual = e.message
          assert.equal(actual, expected)
        }

      })
    })
    describe('"REFRESH RECORDS": get all remote records, decorate, write to local (e.g. for MONITOR)', () => {})
    xdescribe('(sync - i.e. find difference in state between local+remote and rectify)', () => {})
  })
  
  describe('proxied to response/local', () => {
    describe('create - make new record from RECORD', () => {})
    describe('read all - view them all in MONITOR', () => {})
    describe('update - edit in RECORD', () => {})
    xdescribe('(delete) - not yet', () => {})
  })












// responses/controller.js
// calls to these functions come directly from the $store -
// these functions are the API for the $store


})