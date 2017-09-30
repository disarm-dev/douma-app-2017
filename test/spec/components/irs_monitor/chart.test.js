import test from 'ava'
import {shallow} from 'vue-test-utils'

import Chart from 'apps/irs_monitor/pages/charts/chart.vue'

test('can create component', t => {
  const wrapper = shallow(Chart)
  t.true(wrapper.exists())
})
