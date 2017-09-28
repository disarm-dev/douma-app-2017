import test from 'ava'
import sinon from 'sinon'

import {ResponseController} from "lib/models/response/controller"

function setup() {
  const responses = [{id: 1}, {id: 2}]

  const read_all = sinon.stub().returns(Promise.resolve(responses))
  const remote = {read_all}

  const create_bulk = sinon.stub().returns(Promise.resolve())
  const local = {create_bulk}

  const controller = new ResponseController('test')

  controller.local = local
  controller.remote = remote

  return {responses, controller}
}

test("can be instantiated", t => {
  const controller = new ResponseController('test')
  t.true(controller instanceof ResponseController)
})

test.cb("calls remote methods in read_all_network ", t => {
  const {controller} = setup()

  controller.read_all_network().then(() => {
    t.true(controller.remote.read_all.calledOnce)
    t.end()
  })
})

test.cb("calls local methods in read_all_network with correct arguments", t => {
  const {responses, controller} = setup()

  controller.read_all_network().then(() => {
    t.true(controller.local.create_bulk.calledOnce)
    t.deepEqual(responses, controller.local.create_bulk.getCall(0).args[0])

    t.end()
  })
})

test.cb("read_all_network returns responses", t => {
  const {responses, controller} = setup()

  controller.read_all_network().then((actual) => {
    t.deepEqual(responses, actual)
    t.end()
  })
})


