import Vue from 'vue'
import {shallow, mount} from 'vue-test-utils'
import sinon from 'sinon'
import Fields from 'apps/irs_monitor/pages/controls/filters/fields'

describe('fields.vue', () => {
  const responses = [
    {
      field1: {
        field2: 2,
      },
      field3: 3,
      field4: "string 1"
    },
    {
      field1: {
        field2: 3,
      },
      field3: 4,
      field4: "string 2"
    }
  ]
  
  it('should have no field names when there are no responses', () => {
    const wrapper = shallow(Fields)
    assert.deepEqual(wrapper.vm.field_names, [])
  })

  it('should have no field values when there are no responses', () => {
    const wrapper = shallow(Fields)
    assert.deepEqual(wrapper.vm.field_values, [])
  })

  it('should set the filter from props as local variables on created', (done) => {
    const field_filter = {
      filter_name: "field4",
      filter_comparator: 'eq',
      filter_value: 'string 2'
    }

    const wrapper = shallow(Fields, {
      propsData: {responses, field_filter}
    })

    Vue.nextTick(() => {
      assert.equal(wrapper.vm.filter_name, 'field4')
      assert.equal(wrapper.vm.filter_comparator, 'eq')
      assert.equal(wrapper.vm.filter_value, 'string 2')
      done()
    })

  })

  it('should list all the unique fields from responses', () => {
    const wrapper = shallow(Fields)
    wrapper.setProps({responses})
    assert.deepEqual(wrapper.vm.field_names, ['field1.field2', 'field3', 'field4'])
  })
  
  it('should list the possible values after selection a field', () => {
    const wrapper = shallow(Fields)
    wrapper.setProps({responses})
    wrapper.setData({filter_name: 'field3'})
    assert.deepEqual(wrapper.vm.field_values, [3, 4])

    wrapper.setData({filter_name: 'field4'})
    assert.deepEqual(wrapper.vm.field_values, ["string 1", "string 2"])
  })

  it('should emit change when adding a filter', () => {
    const wrapper = shallow(Fields, {
      propsData: {responses}
    })

    sinon.spy(wrapper.vm, '$emit')

    wrapper.setData({filter_name: 'field4', filter_comparator: 'eq', filter_value: 'string 2'})

    wrapper.vm.add_filter()

    assert.isTrue(wrapper.vm.$emit.calledOnce)
  })

  it('should emit change with a valid filter', () => {
    const wrapper = shallow(Fields, {
      propsData: {responses}
    })

    const expected = {
      name: 'field4',
      comparator: 'eq',
      value: 'string 2'
    }

    sinon.spy(wrapper.vm, '$emit')

    wrapper.setData({filter_name: 'field4', filter_comparator: 'eq', filter_value: 'string 2'})

    wrapper.vm.add_filter()

    assert.equal(wrapper.vm.$emit.getCall(0).args[0], 'change')
    assert.deepEqual(wrapper.vm.$emit.getCall(0).args[1], expected)
  })
  
})
