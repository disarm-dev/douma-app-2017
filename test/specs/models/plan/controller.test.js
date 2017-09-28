import test from 'ava'
import sinon from 'sinon'

import {PlanController} from "lib/models/plan/controller"

test('it can be instantiated', t => {
  const controller = new PlanController('test')
  t.true(controller instanceof PlanController)
})

test.cb('read_plan_current_network calls remote', t => {
  const controller = new PlanController('test')

  controller.remote = {
    read_plan_current: sinon.stub().returns(Promise.resolve())
  }

  controller.read_plan_current_network().then(() => {
    t.true(controller.remote.read_plan_current.calledOnce)
    t.end()
  })
})

test.cb('read_plan_current_local calls local', t => {
  const controller = new PlanController('test')

  controller.local = {
    read: sinon.stub().returns(Promise.resolve())
  }

  controller.read_plan_current_local().then(() => {
    t.true(controller.local.read.calledOnce)
    t.end()
  })
})

test.cb('create_plan calls local and remote', t => {
  const controller = new PlanController('test')

  controller.local = {
    create: sinon.stub().returns(Promise.resolve())
  }

  controller.remote = {
    create_plan: sinon.stub().returns(Promise.resolve())
  }

  controller.create_plan().then(() => {
    t.true(controller.local.create.calledOnce)
    t.true(controller.remote.create_plan.calledOnce)
    t.end()
  })
})

test.cb('create_plan calls local and remote with correct arguments', t => {
  const controller = new PlanController('test')

  controller.local = {
    create: sinon.stub().returns(Promise.resolve())
  }

  controller.remote = {
    create_plan: sinon.stub().returns(Promise.resolve())
  }

  const plan = {id: 1}

  controller.create_plan(plan).then(() => {
    t.deepEqual(plan, controller.local.create.getCall(0).args[0])
    t.deepEqual(plan, controller.remote.create_plan.getCall(0).args[0])
    t.end()
  })
})



