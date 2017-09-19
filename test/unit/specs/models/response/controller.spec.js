describe('responses.controller', () => {


  describe('WOVEN TOGETHER', () => {
    it('"SYNC NEW RECORDS": get all new local records, write to remote (e.g. for RECORD)', () => {})

    it('"REFRESH RECORDS": get all remote records, decorate, write to local (e.g. for MONITOR)', () => {})

    xit('(sync - i.e. find difference in state between local+remote and rectify)', () => {})
  })








// responses/local.js
  // create
  // (read one) - we get single records from $store
  // read all
  // update
  // (delete) - not currently used, closely linked to `update`

// responses/remote.js
  // create
  // (read one)
  // read all
  // (update)
  // (delete)

// responses/controller.js
// calls to these functions come directly from the $store -
// these functions are the API for the $store


})