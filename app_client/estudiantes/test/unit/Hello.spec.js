// "https://scotch.io/tutorials/how-to-write-a-unit-test-for-vuejs?utm_content=buffer0eaf1&utm_medium=social&utm_source=facebook.com&utm_campaign=buffer"

import Vue from 'vue'
import Hello from '../../src/components/Hello.vue'

describe('Hello.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: (h) => h(Hello)
    })
    expect(vm.$el.querySelector('h1').textContent).toBe('Welcome to Your Vue.js App')
  })
})

// also see example testing a component with mocks at
// https://github.com/vuejs/vueify-example/blob/master/test/unit/a.spec.js#L22-L43
