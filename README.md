# vue-svg-sprite

![experimental](https://img.shields.io/badge/stability-experimental-red.svg?style=flat-square) [![NPM version](https://img.shields.io/npm/v/vue-svg-sprite.svg?style=flat-square)](https://www.npmjs.com/package/vue-svg-sprite)

> Vue.js directive to simply use SVG sprite

This version (1.0.1) is compatible with Vue.js 2.0

## Draft (wip)

This Vue.js plugin will add some attributes (`viewBox`, `width` and `height`) and the appropriate `<use>` to `<svg>` elements.

* Use an external SVG file
* Use `expression` or `symbol` attribute to link the correct `<symbol>`
* Use `size` attribute for `viewBox`, `width` and `height` (`<svg>`)
    - Comma or space separated values
    - 1, 2 or 4 values accepted
    - 1 value: x/y = 0, width = height (e.g.: 24)
    - 2 values: x/y = 0, width, height (e.g.: 24 24)
    - 4 values: x, y, width, height (e.g.: 0 0 24 24)
* Options:
    - `url`: path to external SVG file (default: `/assets/svg/sprite.svg`)
    - `class`: class for the SVG element (default: `icon`)

NB: If the className is already used (eg: via a modifier like `icon--inline`), the class option is not added…

## Setup

```js
import Vue from 'vue';
import SvgSprite from 'vue-svg-sprite';

Vue.use(SvgSprite, {
  url: '/path/to/svg-sprite-file.svg',
  class: 'icon'
});
```

## Basic usage

```html
<svg v-svg="icons-dashboard"></svg>
```

output:

```html
<svg class="icon">
  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svg/sprite.svg#icons-dashboard"></use>
</svg>
```

## Advanced usage

```html
<svg role="presentation" class="icon--inline" v-svg symbol="icons-dashboard" size="0 0 24 24"></svg>
```

output:

```html
<svg role="presentation" class="icon--inline" viewBox="0 0 24 24" width="24" height="24">
  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svg/sprite.svg#icons-companies"></use>
</svg>
```

-----

> To generate the SVG sprite file, you can use [gulp-svgstore](https://github.com/w0rm/gulp-svgstore) or [grunt-svgstore](https://github.com/FWeinb/grunt-svgstore).

-----

[![NPM](https://nodei.co/npm/vue-svg-sprite.png)](https://www.npmjs.com/package/vue-svg-sprite)

## License

MIT, see [LICENSE.md](https://github.com/thierrymichel/vue-svg-sprite/blob/master/LICENSE) for details.
