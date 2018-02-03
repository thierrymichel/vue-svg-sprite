/* global test, expect */

import Vue from 'vue/dist/vue';
import SvgSprite from '../src';

Vue.use(SvgSprite);

test('add use href with expression', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg="icon"></svg>
    </div>`,
    data: { icon: 'icon1' },
  }).$mount();

  const href = vm.$el.querySelector('use').getAttribute('xlink:href');

  expect(href).toBe('/assets/svg/sprite.svg#icon1');
});

test('add use href with symbol', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2"></svg>
    </div>`,
  }).$mount();

  const href = vm.$el.querySelector('use').getAttribute('xlink:href');

  expect(href).toBe('/assets/svg/sprite.svg#icon2');
});

test('add use href with expression + symbol', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg="icon" symbol="icon2"></svg>
    </div>`,
    data: { icon: 'icon1' },
  }).$mount();

  const href = vm.$el.querySelector('use').getAttribute('xlink:href');

  expect(href).toBe('/assets/svg/sprite.svg#icon1');
});

test('add size attribute, 1 value', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2" size="42"></svg>
    </div>`,
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
    template: `<div>
    <svg v-svg symbol="icon2" size="42 24"></svg>
    </div>`,
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
    template: `<div>
      <svg v-svg symbol="icon2" size="6 12 42 24"></svg>
    </div>`,
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
    template: `<div>
      <svg v-svg symbol="icon2" size="6 12 42"></svg>
    </div>`,
  }).$mount();

  const svg = vm.$el.querySelector('svg');
  const size = svg.getAttribute('size');

  expect(size).toBe('6 12 42');
});

test('add invalid size attribute, 5 values', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2" size="3 6 12 24 42"></svg>
    </div>`,
  }).$mount();

  const svg = vm.$el.querySelector('svg');
  const size = svg.getAttribute('size');

  expect(size).toBe('3 6 12 24 42');
});

test('add default class', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2"></svg>
    </div>`,
  }).$mount();

  const cssClass = vm.$el.querySelector('svg').getAttribute('class');

  expect(cssClass).toBe('icon');
});

test('do not ovewrite default classname', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2" class="icon--inline"></svg>
    </div>`,
  }).$mount();

  const cssClass = vm.$el.querySelector('svg').getAttribute('class');

  expect(cssClass).toBe('icon--inline');
});

test('keep other classnames', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2" class="foo bar"></svg>
    </div>`,
  }).$mount();

  const cssClass = vm.$el.querySelector('svg').getAttribute('class');

  expect(cssClass).toBe('foo bar icon');
});

test('do not overwrite + keep other classnames', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2" class="icon--inline foo bar"></svg>
    </div>`,
  }).$mount();

  const cssClass = vm.$el.querySelector('svg').getAttribute('class');

  expect(cssClass).toBe('icon--inline foo bar');
});

test('keep other attributes', () => {
  const vm = new Vue({
    template: `<div>
      <svg v-svg symbol="icon2" role="presentation"></svg>
    </div>`,
  }).$mount();

  const role = vm.$el.querySelector('svg').getAttribute('role');

  expect(role).toBe('presentation');
});

test('update use href', () => {
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

    expect(href).toBe('/assets/svg/sprite.svg#icon2');
  });
});
