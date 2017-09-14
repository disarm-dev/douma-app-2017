import {shallow} from 'vue-test-utils'
import Fields from 'apps/irs_monitor/pages/controls/filters/fields'

describe('fields.vue', () => {
  const responses = [
    {
      field1: {
        field2: 2,
      },
      field3: 3
    },
    {
      field1: {
        field2: 3,
      },
      field3: 4
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
    assert.deepEqual(wrapper.vm.field_names, ['field1.field2', 'field3'])
  })
  
  it('should list the possible values after selection a field', () => {
    const wrapper = shallow(Fields)
    wrapper.setProps({responses})
    wrapper.setData({filter_name: 'field3'})
    assert.deepEqual(wrapper.vm.field_values, [3, 4])
  })
  
})
