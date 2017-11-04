import test from 'ava'
import {shallow, mount} from 'vue-test-utils'

import limit_to from 'apps/irs_monitor/pages/controls/limit-to.vue'

test('cannot select responses if empty responses array', t => {
  const wrapper = shallow(limit_to, {propsData: {responses: []}})
  t.true(wrapper.vm.responses_disabled)
})

test('can select responses if more than zero responses', t => {
  const wrapper = shallow(limit_to, {propsData: {responses: [1]}})
  t.false(wrapper.vm.responses_disabled)
})

test('cannot select targets if empty targets array', t => {
  const wrapper = shallow(limit_to, {propsData: {targets: []}})
  t.true(wrapper.vm.targets_disabled)
})

test('can select targets if more than zero targets', t => {
  const wrapper = shallow(limit_to, {propsData: {targets: [1]}})
  t.false(wrapper.vm.targets_disabled)
})

// TODO: @refac limit_to to have `disabled` computed, rather than testing the DOM
test.skip('responses_disabled actually disables the responses radio button', t => {
  const wrapper = mount(limit_to)
  t.true(wrapper.vm.responses_disabled)
  t.true(wrapper.vm.$refs.responses.disabled)
})

// TODO: @refac limit_to to have `disabled` computed, rather than testing the DOM
test.skip('responses_disabled does not disable the responses radio button', t => {
  const wrapper = mount(limit_to, {propsData: {responses: [1]}})
  t.false(wrapper.vm.responses_disabled)
  t.false(wrapper.vm.$refs.responses.disabled)
})

test.failing('without anything passed in, starts with default value of `all`', t => {
  const wrapper = shallow(limit_to)
  t.is(wrapper.vm.local_selected_limit, 'all')
})

