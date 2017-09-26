import test from 'ava'
import moxios from 'moxios'

import remote from 'lib/models/response/remote'
import {instantiate_axios_instance} from 'lib/remote/axios_instance'

test.beforeEach(() => {
  instantiate_axios_instance()
  moxios.install()
})

test.afterEach(() => {
  moxios.uninstall()
})


test.failing.cb('test test', t => {
  remote.read_all().then(() => {
    moxios.wait(function () {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: [
          { id: 1, firstName: 'Fred', lastName: 'Flintstone' },
          { id: 2, firstName: 'Wilma', lastName: 'Flintstone' }
        ]
      }).then(function () {
        t.end()
      })
    })
  }).catch(() => {
    t.fail('caught error')
    t.end()
  })

})
