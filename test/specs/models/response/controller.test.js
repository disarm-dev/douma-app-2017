import test from 'ava'
import sinon from 'sinon'

import {ResponseController} from "lib/models/response/controller"

test("can be instantiated", t => {
  const controller = new ResponseController('test')
  t.true(controller instanceof ResponseController)
})

test.cb("calls remote and local methods in read_all_network and returns result", t => {

  const responses = [{id: 1}, {id: 2}]

  const read_all = sinon.stub().returns(Promise.resolve(responses))
  const remote = { read_all }

  const create_bulk = sinon.stub().returns(Promise.resolve())
  const local = { create_bulk }

  const controller = new ResponseController('test')

  controller.local = local
  controller.remote = remote


  controller.read_all_network().then((actual) => {
    t.true(controller.remote.read_all.calledOnce)
    t.true(controller.local.create_bulk.calledOnce)

    t.deepEqual(responses, controller.local.create_bulk.getCall(0).args[0])
    t.deepEqual(responses, actual)

    t.end()
  })
})

