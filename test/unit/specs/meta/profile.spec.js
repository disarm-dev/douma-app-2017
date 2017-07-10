import Vue from 'vue'
import VueRouter from 'vue-router'
import view from 'apps/meta/applet.vue'
Vue.use(VueRouter)

xdescribe('meta/home.vue', () => {
  it('should render correct contents if you are not logged in', () => {
    const router = new VueRouter({routes: [
      {path: '/', component: {render: h => '-'}}
    ]})
    const Constructor = Vue.extend(view)
    const vm = new Constructor({router: router}).$mount()
    router.push('/')
    const actual = vm.$el.querySelector('h1').textContent
    assert.equal(actual, 'Meta', "displays Meta on the page")
  })
})
