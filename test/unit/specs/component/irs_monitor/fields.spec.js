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

  it('should emit a change event when filter_value changes', (next) => {
    const wrapper = shallow(Fields)
    const change_stub = sinon.stub()

    wrapper.setMethods({change_handler: change_stub})
    wrapper.setProps({responses})

    wrapper.setData({filter_name: 'field4'})
    wrapper.setData({filter_value: 'string 2'})

    Vue.nextTick(() => {
      assert.isTrue(change_stub.called)
      next()
    })


  })
  
})
