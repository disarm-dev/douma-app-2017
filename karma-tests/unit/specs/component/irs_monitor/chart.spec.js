import Vue from 'vue'
import {shallow} from 'vue-test-utils'

import Chart from 'apps/irs_monitor/pages/charts/chart.vue'


describe('chart.vue', () => {

  xit('try without a chart_type and throw an error', () => {
    const Ctor = Vue.extend(Chart)
    const fn = new Ctor().$mount
    const vm = fn()
    console.log('vm', vm)

    assert.throws(fn, 'Missing `options.chart_type`')
  })

  it('can create component', () => {
    const wrapper = shallow(Chart)
    assert.isTrue(wrapper.exists())
  })
})