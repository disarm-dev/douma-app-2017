// import Vue from 'vue'
// import Hello from '@/apps/meta/pages/home.vue'

// describe('home.vue', () => {
//   it('should render correct contents', () => {
//     const Constructor = Vue.extend(Hello)
//     const vm = new Constructor().$mount()
//     expect(vm.$el.querySelector('.hello h1').textContent)
//       .to.equal('Welcome to Your Vue.js App')
//   })
// })


describe('not a real test', () => {
  it('it be true', () => {
    assert.lengthOf('123', 3)
  })

  it('it has a property', () => {
    const thing = {value: 1}
    assert.property(thing, 'values', "should not have values, just value");
  })

  it('passes after the previous one failed', () => {
    assert.isTrue(true)
  })
})