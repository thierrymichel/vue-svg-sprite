/* global test, expect */

import Vue from 'vue';
// import Vue from 'vue/dist/vue.js';
import SvgSprite from '../src';

// const vueTest: any = Vue;

Vue.use(SvgSprite);

test('add use href with value', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          directives: [{ name: 'svg', value: 'icon1' }]
        })]
      );
    }
  }).$mount();

  const href = vm.$el.querySelector('use').getAttribute('href');
  const xlinkHref = vm.$el.querySelector('use').getAttribute('xlink:href');

  expect(href).toBe('/assets/svg/sprite.svg#icon1');
  expect(xlinkHref).toBe('/assets/svg/sprite.svg#icon1');
});

test('add use href with symbol', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: 'icon2' },
          directives: [{ name: 'svg' }],
        })]
      );
    }
  }).$mount();

  const href = vm.$el.querySelector('use').getAttribute('href');
  const xlinkHref = vm.$el.querySelector('use').getAttribute('xlink:href');

  expect(href).toBe('/assets/svg/sprite.svg#icon2');
  expect(xlinkHref).toBe('/assets/svg/sprite.svg#icon2');
});

test('add use href with expression + symbol', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: 'icon2' },
          directives: [{ name: 'svg', value: 'icon1' }],
        })]
      );
    }
  }).$mount();

  const href = vm.$el.querySelector('use').getAttribute('href');
  const xlinkHref = vm.$el.querySelector('use').getAttribute('xlink:href');

  expect(href).toBe('/assets/svg/sprite.svg#icon1');
  expect(xlinkHref).toBe('/assets/svg/sprite.svg#icon1');
});

test('add size attribute, 1 value', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { size: '42' },
          directives: [{ name: 'svg', value: 'icon2' }],
        })]
      );
    }
  }).$mount();

  const svg = vm.$el.querySelector('svg');
  const viewBox = svg.getAttribute('viewBox');
  const width = svg.getAttribute('width');
  const height = svg.getAttribute('height');

  expect(viewBox).toBe('0 0 42 42');
  expect(width).toBe('42');
  expect(height).toBe('42');
});

test('add size attribute, 2 values', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { size: '42 24' },
          directives: [{ name: 'svg', value: 'icon2' }],
        })]
      );
    }
  }).$mount();

  const svg = vm.$el.querySelector('svg');
  const viewBox = svg.getAttribute('viewBox');
  const width = svg.getAttribute('width');
  const height = svg.getAttribute('height');

  expect(viewBox).toBe('0 0 42 24');
  expect(width).toBe('42');
  expect(height).toBe('24');
});

test('add size attribute, 4 values', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { size: '6 12 42 24' },
          directives: [{ name: 'svg', value: 'icon2' }],
        })]
      );
    }
  }).$mount();

  const svg = vm.$el.querySelector('svg');
  const viewBox = svg.getAttribute('viewBox');
  const width = svg.getAttribute('width');
  const height = svg.getAttribute('height');

  expect(viewBox).toBe('6 12 42 24');
  expect(width).toBe('42');
  expect(height).toBe('24');
});

test('add invalid size attribute, 3 values', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { size: '6 12 42' },
          directives: [{ name: 'svg', value: 'icon2' }],
        })]
      );
    }
  }).$mount();

  const svg = vm.$el.querySelector('svg');
  const size = svg.getAttribute('size');

  expect(size).toBe('6 12 42');
});

test('add invalid size attribute, 5 values', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { size: '3 6 12 24 42' },
          directives: [{ name: 'svg', value: 'icon2' }],
        })]
      );
    }
  }).$mount();

  const svg = vm.$el.querySelector('svg');
  const size = svg.getAttribute('size');

  expect(size).toBe('3 6 12 24 42');
});

test('add default class', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: 'icon2' },
          directives: [{ name: 'svg' }],
        })]
      );
    }
  }).$mount();

  const cssClass = vm.$el.querySelector('svg').getAttribute('class');

  expect(cssClass).toBe('icon');
});

test('do not ovewrite default classname', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: 'icon2', class: 'icon--inline' },
          directives: [{ name: 'svg' }],
        })]
      );
    }
  }).$mount();

  const cssClass = vm.$el.querySelector('svg').getAttribute('class');

  expect(cssClass).toBe('icon--inline');
});

test('keep other classnames', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: 'icon2', class: 'foo bar' },
          directives: [{ name: 'svg' }],
        })]
      );
    }
  }).$mount();

  const cssClass = vm.$el.querySelector('svg').getAttribute('class');

  expect(cssClass).toBe('foo bar icon');
});

test('do not overwrite + keep other classnames', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: 'icon2', class: 'icon--inline foo bar' },
          directives: [{ name: 'svg' }],
        })]
      );
    }
  }).$mount();

  const cssClass = vm.$el.querySelector('svg').getAttribute('class');

  expect(cssClass).toBe('icon--inline foo bar');
});

test('keep other attributes', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: 'icon2', role: 'presentation' },
          directives: [{ name: 'svg' }],
        })]
      );
    }
  }).$mount();

  const role = vm.$el.querySelector('svg').getAttribute('role');

  expect(role).toBe('presentation');
});

test('multiple instances', () => {
  const vm = new Vue({
    render(h) {
      return h('div',
        [
          h('svg', {
            attrs: { symbol: 'icon1' },
            directives: [{ name: 'svg' }],
          }),
          h('svg', {
            attrs: { symbol: 'icon2' },
            directives: [{ name: 'svg' }],
          }),
        ]
      );
    }
  }).$mount();

  const href1 = vm.$el.querySelectorAll('use')[0].getAttribute('href');
  const xlinkHref1 = vm.$el.querySelectorAll('use')[0].getAttribute('xlink:href');
  const xlinkHref2 = vm.$el.querySelectorAll('use')[1].getAttribute('href');
  const href2 = vm.$el.querySelectorAll('use')[1].getAttribute('xlink:href');

  expect(href1).toBe('/assets/svg/sprite.svg#icon1');
  expect(xlinkHref1).toBe('/assets/svg/sprite.svg#icon1');
  expect(href2).toBe('/assets/svg/sprite.svg#icon2');
  expect(xlinkHref2).toBe('/assets/svg/sprite.svg#icon2');
});

test('update use href with expression', () => {
  const vm = new Vue({
    data: { icon: 'icons1' },
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

    expect(href).toBe('/assets/svg/sprite.svg#icon2');
    expect(xlinkHref).toBe('/assets/svg/sprite.svg#icon2');
  });
});

test('update use href with symbol', () => {
  const vm = new Vue({
    data: { icon: 'icon1' },
    render(h) {
      return h('div',
        [h('svg', {
          attrs: { symbol: this.icon },
          directives: [{ name: 'svg' }],
        })]
      );
    },
  }).$mount();

  // Change state and wait for one tick until checking
  vm.icon = 'icon2';
  Vue.nextTick(() => {
    const href = vm.$el.querySelector('use').getAttribute('href');
    const xlinkHref = vm.$el.querySelector('use').getAttribute('xlink:href');

    expect(href).toBe('/assets/svg/sprite.svg#icon2');
    expect(xlinkHref).toBe('/assets/svg/sprite.svg#icon2');
  });
});
