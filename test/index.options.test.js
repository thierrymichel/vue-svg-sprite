/* global test, expect */

import Vue from 'vue/dist/vue';
import SvgSprite from '../src';

Vue.use(SvgSprite, {
  url: '',
  class: 'my-class',
});

test('set custom path', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2"></svg>
    </div>`,
  }).$mount();

  const href = vm.$el.querySelector('use').getAttribute('xlink:href');

  expect(href).toBe('#icon2');
});

test('set custom class', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2"></svg>
    </div>`,
  }).$mount();

  const className = vm.$el.querySelector('svg').getAttribute('class');

  expect(className).toBe('my-class');
});


test('update use href with custom path', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg="icon"></svg>
    </div>`,
    data: { icon: 'icon1' },
  }).$mount();

  // Change state and wait for one tick until checking
  vm.icon = 'icon2';
  Vue.nextTick(() => {
    const href = vm.$el.querySelector('use').getAttribute('xlink:href');

    expect(href).toBe('#icon2');
  });
});
