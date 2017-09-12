import Vue from 'vue'

import limit_to from 'apps/irs_monitor/pages/controls/limit-to.vue'

describe('limit-to.vue', () => {

  function createComponent(propsData = {})  {
    const Ctor = Vue.extend(limit_to)
    return new Ctor({propsData}).$mount()
  }

  describe('radio button disables', () => {
    it('cannot select responses if empty responses array', () => {
      const vm = createComponent({responses: []})
      assert.isTrue(vm.responses_disabled)
    })

    it('can select responses if more than zero responses', () => {
      const vm = createComponent({responses: [1]})
      assert.isFalse(vm.responses_disabled)
    })

    it('cannot select targets if empty targets array', () => {
      const vm = createComponent({targets: []})
      assert.isTrue(vm.targets_disabled)
    })

    it('can select targets if more than zero targets', () => {
      const vm = createComponent({targets: [1]})
      assert.isFalse(vm.targets_disabled)
    })

    it('responses_disabled actually disables the responses radio button', () => {
      const vm = createComponent()
      assert.isTrue(vm.responses_disabled)
      assert.isTrue(vm.$refs.responses.disabled)
    })

    it('responses_disabled does not disable the responses radio button', () => {
      const vm = createComponent({responses: [1]})
      assert.isFalse(vm.responses_disabled)
      assert.isFalse(vm.$refs.responses.disabled)
    })
  })

  describe('receives and sets selected_limit', () => {
    it('without anything passed in, starts with default value of `all`', () => {
      const vm = createComponent()
      assert.equal(vm.local_selected_limit, 'all')
    })
  })

})