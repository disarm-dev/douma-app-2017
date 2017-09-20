import remote from 'lib/models/response/remote'
import sinon from 'sinon'
import axios from 'axios'
import {configure_standard_handler} from "lib/remote/standard-handler"


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
  
  describe('remote calls', () => {
    it('should display a blankslate', (done) => {
      const sandbox = sinon.sandbox.create()
      const resolved = new Promise((r) => r({ data: [1] }));
      sandbox.stub(axios, 'get').returns(resolved);

      axios.get('/record/all')
        .then(({data}) => {
          assert.equal(data.length, 1)
          assert.equal(data[0], 1)
          done()
          sandbox.restore()
        })
        .catch((e) => {
          done()
          sandbox.restore()
        })


    });

    it('should work', (done) => {
      const sandbox = sinon.sandbox.create()
      const resolved = new Promise((r) => r({ data: [1,2,3,4,5] }));
      sandbox.stub(axios, 'get').returns(resolved);

      const callback = sinon.spy()

      configure_standard_handler({})
      // assert(false)
      remote.read_all()
        .then((res) => {
          console.log('res', res)
          sandbox.restore()
          done()

        })
        // .catch((e) => {
        //   assert(false)
        //   done()
        //   sandbox.restore()
        // })


      // assert(callback.called)
    })

    xit('should return responses as an array', async () => {
      const server = sinon.createFakeServer();

      server.respondWith("GET", "/record/all", [200, { "Content-Type": "application/json" }, '[{ "id": 12, "comment": "Hey there" }]']);

      const callback = sinon.spy();

      axios.get('/record/all')
        .then(callback)
        .catch(console.log)
      // remote.read_all().then(callback)

      server.respond()

      assert.equal(callback.called, true)
      // assert.equal(callback.calledWith([{ id: 12, comment: "Hey there" }]), true)

      server.restore()

      // assert(false)
    })

  })
})