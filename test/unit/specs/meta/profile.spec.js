import Vue from 'vue'
import view from '@/apps/meta/pages/home.vue'

describe('meta/home.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(view)
    const vm = new Constructor().$mount()
    const actual = vm.$el.querySelector('h1').textContent
    assert.equal(actual, 'Meta', "displays Meta on the page")
  })
})
