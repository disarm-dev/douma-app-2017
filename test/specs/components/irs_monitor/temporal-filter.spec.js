import Vue from 'vue'
import {shallow, mount} from 'vue-test-utils'
import sinon from 'sinon'
import TemporalFilters from 'apps/irs_monitor/pages/controls/filters/temporal.vue'

describe('temporal-filters.vue', () => {
  const responses = [
    {
      recorded_on: new Date("2017-9-1").toString()
    },
    {
      recorded_on: new Date("2017-9-3").toString()
    },
    {
      recorded_on: new Date("2017-9-5").toString()
    }
  ]

  it('should not crash if no responses are passed in', () => {
    const wrapper = shallow(TemporalFilters)

    assert.doesNotThrow(wrapper.vm.set_start_and_end_dates, TypeError)
  })

  it('should not have start and end be null when responses change', () => {
    const wrapper = shallow(TemporalFilters)

    wrapper.setProps({responses})

    const actual_start = wrapper.vm.start

    assert.isNotNull(actual_start)

    const actual_end = wrapper.vm.end
    assert.isNotNull(actual_end)
  })


  it('should set the start date to the earliest date from the responses', () => {
    const wrapper = shallow(TemporalFilters, {
      propsData: {responses}
    })

    const expected = new Date(responses[0].recorded_on).getTime()
    const actual = wrapper.vm.start.getTime()

    assert.equal(expected, actual)
  })

  it('should set the end date to the latest date from the responses', () => {
    const wrapper = shallow(TemporalFilters, {
      propsData: {responses}
    })

    const expected = new Date(responses[2].recorded_on).getTime()
    const actual = wrapper.vm.end.getTime()
    assert.equal(expected, actual)
  })

  it('should reset start and end dates when calling set_start_and_end_dates()', () => {
    const wrapper = shallow(TemporalFilters, {
      propsData: {responses}
    })

    wrapper.vm.start = new Date("2017-9-2")
    wrapper.vm.end= new Date("2017-9-9")

    wrapper.vm.set_start_and_end_dates()

    const expected_start = new Date(responses[0].recorded_on).getTime()
    const actual_start = wrapper.vm.start.getTime()

    assert.equal(expected_start, actual_start)

    const expected_end = new Date(responses[2].recorded_on).getTime()
    const actual_end = wrapper.vm.end.getTime()

    assert.equal(expected_end, actual_end)

  })

  it('should emit 2 change events when adding the temporal filter', () => {
    const wrapper = shallow(TemporalFilters, {
      propsData: {responses}
    })

    sinon.spy(wrapper.vm, '$emit')

    wrapper.vm.add_temporal_filter()

    assert.equal(wrapper.vm.$emit.calledTwice, true)
  })

  it('should emit 2 valid temporal filters when adding the temporal filter', () => {
    const wrapper = shallow(TemporalFilters, {
      propsData: {responses}
    })

    sinon.spy(wrapper.vm, '$emit')

    wrapper.vm.add_temporal_filter()

    const expected_start = {name: 'recorded_on', comparator: '>', value: new Date(responses[0].recorded_on).getTime()}
    const actual_start = wrapper.vm.$emit.getCall(0).args[1]
    assert.deepEqual(expected_start, actual_start)


    const expected_end = {name: 'recorded_on', comparator: '<', value: new Date(responses[2].recorded_on).getTime()}
    const actual_end = wrapper.vm.$emit.getCall(1).args[1]
    assert.deepEqual(expected_end, actual_end)
  })

  it('should not emit a filter when there are no responses', () => {
    const wrapper = shallow(TemporalFilters)

    sinon.spy(wrapper.vm, '$emit')

    wrapper.vm.add_temporal_filter()

    assert.equal(wrapper.vm.$emit.called, false)
  })


})