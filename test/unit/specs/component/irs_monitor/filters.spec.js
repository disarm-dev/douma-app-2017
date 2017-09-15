import Vue from 'vue'
import {shallow, mount} from 'vue-test-utils'
import sinon from 'sinon'
import Filters from 'apps/irs_monitor/pages/controls/filters/filters'

xdescribe('filters.vue', () => {
  it('should call set_field_filter on change from field_filters.vue', () => {
    const wrapper = mount(Filters)
  })
})
