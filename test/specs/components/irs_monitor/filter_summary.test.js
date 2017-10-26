import test from 'ava'
import {shallow, mount} from 'vue-test-utils'
import sinon from 'sinon'
import Summary from 'apps/irs_monitor/pages/controls/filters/summary.vue'


const filters = [
  {name: 'filter_name', comparator: 'eq', value: 'filter_value'},
  {name: 'filter_name2', comparator: 'eq', value: 'filter_value2'}
]

test('should accept filters as a prop', t => {
  const wrapper = mount(Summary, {
    propsData: {filters}
  })

  t.true(wrapper.hasProp('filters', filters))
})

test('should emit remove_filter event when removing a filter', t => {
  const wrapper = shallow(Summary, {
    propsData: {filters}
  })

  sinon.spy(wrapper.vm, '$emit')

  wrapper.vm.on_delete(filters[0])

  t.true(wrapper.vm.$emit.calledOnce)

  t.deepEqual(wrapper.vm.$emit.getCall(0).args[0], 'remove_filter')
  t.deepEqual(wrapper.vm.$emit.getCall(0).args[1], filters[0])
})


test('should format a recorded_on filter', t => {
  const filters = [{name: 'recorded_on', comparator: 'eq', value: 'Thu Oct 26 2017 09:37:17 GMT+0200 (SAST)'}]

  const wrapper = shallow(Summary, {
    propsData: {filters}
  })

  const actual = wrapper.vm.formatted_filters[0]
  const expected = {name: 'recorded_on', comparator: 'eq', value: 'Oct 26th 2017'}

  t.deepEqual(actual, expected)
})

test('should not format a filter that is not recorded_on', t => {
  const filters = [{name: 'some_value', comparator: 'eq', value: 'Thu Oct 26 2017 09:37:17 GMT+0200 (SAST)'}]

  const wrapper = shallow(Summary, {
    propsData: {filters}
  })

  const actual = wrapper.vm.formatted_filters[0]
  const expected = {name: 'some_value', comparator: 'eq', value: 'Thu Oct 26 2017 09:37:17 GMT+0200 (SAST)'}

  t.deepEqual(actual, expected)
})