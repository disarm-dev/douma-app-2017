import Vue from 'vue'
import {shallow, mount} from 'vue-test-utils'
import sinon from 'sinon'
import Summary from 'apps/irs_monitor/pages/controls/filters/summary.vue'

describe('summary.vue', () => {

  const filters = [
    {name: 'filter_name', comparator: 'eq', value: 'filter_value'},
    {name: 'filter_name2', comparator: 'eq', value: 'filter_value2'}
  ]

  it('should accept filters as a prop', () => {
    const wrapper = mount(Summary)
    wrapper.setProps({filters})

    assert.isTrue(wrapper.hasProp('filters', filters))
  })

  it('should emit remove_filter event when removing a filter', () => {
    const wrapper = shallow(Summary, {
      propsData: {filters}
    })

    sinon.spy(wrapper.vm, '$emit')

    wrapper.vm.on_delete(filters[0])

    assert.isTrue(wrapper.vm.$emit.calledOnce)

    assert.deepEqual(wrapper.vm.$emit.getCall(0).args[0], 'remove_filter')
    assert.deepEqual(wrapper.vm.$emit.getCall(0).args[1], filters[0])
  })
})
