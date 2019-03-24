/* global test, expect */

import Vue from 'vue';
import SvgSprite from '../src';

Vue.use(SvgSprite, {
  class: 'my-class',
  url: '',
});

test('set custom path', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: 'icon2' },
          directives: [{ name: 'svg' }],
        })]
      );
    },
  }).$mount();

  const href = vm.$el.querySelector('use').getAttribute('href');
  const xlinkHref = vm.$el.querySelector('use').getAttribute('xlink:href');

  expect(href).toBe('#icon2');
  expect(xlinkHref).toBe('#icon2');
});

test('set custom class', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: 'icon2' },
          directives: [{ name: 'svg' }],
        })]
      );
    },
  }).$mount();

  const className = vm.$el.querySelector('svg').getAttribute('class');

  expect(className).toBe('my-class');
});

test('update use href with custom path', () => {
  const vm = new Vue({
    data: { icon: 'icon1' },
    render(h) {
      return h('div',
        [h('svg', {
          directives: [{ name: 'svg', value: this.icon }],
        })]
      );
    },
  }).$mount();

  // Change state and wait for one tick until checking
  vm.icon = 'icon2';
  Vue.nextTick(() => {
    const href = vm.$el.querySelector('use').getAttribute('href');
    const xlinkHref = vm.$el.querySelector('use').getAttribute('xlink:href');

    expect(href).toBe('#icon2');
    expect(xlinkHref).toBe('#icon2');
  });
});
