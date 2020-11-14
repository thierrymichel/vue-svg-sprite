# vue-svg-sprite

![stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat-square)
[![NPM version](https://img.shields.io/npm/v/vue-svg-sprite.svg?style=flat-square)](https://www.npmjs.com/package/vue-svg-sprite)
[![Coverage Status](https://img.shields.io/coveralls/thierrymichel/vue-svg-sprite/master.svg?style=flat-square)](https://coveralls.io/github/thierrymichel/vue-svg-sprite?branch=master)

> Vue.js directive to simply use SVG sprite

This version (1.x.x) is compatible with Vue.js 2.0 (thanks to [@lovethebomb](https://github.com/lovethebomb))

## Description

This Vue.js plugin will add some attributes (`viewBox`, `width` and `height`) and the appropriate `<use>` to `<svg>` elements.

* Use inline SVG spritesheet or an external SVG file
* Use `expression` or `symbol` attribute to link the correct `<symbol>`
* Use `size` attribute for `viewBox`, `width` and `height` (`<svg>`)
  - Comma or space separated values
  - 1, 2 or 4 values accepted
  - 1 value: x/y = 0, width = height (e.g.: 24)
  - 2 values: x/y = 0, width, height (e.g.: 24 24)
  - 4 values: x, y, width, height (e.g.: 0 0 24 24)
* Options:
  - `url`: path to external SVG file (default: `/assets/svg/sprite.svg`, use `''` for inline)
  - `class`: class for the SVG element (default: `icon`)

NB: If the className is already used (eg: via a modifier like `icon--inline`), the class option is not added…

## Setup

```js
import Vue from 'vue';
import SvgSprite from 'vue-svg-sprite';

Vue.use(SvgSprite);
```

### SSR

If you are using this plugin with [vue-server-renderer](https://ssr.vuejs.org/api/#renderer-options) (directly or under the hood: [NuxtJS](https://fr.nuxtjs.org/), [Vapper](https://vapperjs.org/), …), server needs to render the directive specifically:

```js
// Some config file…
const SvgSprite = require('vue-svg-sprite')

module.exports = {
  rendererOptions: {
    directives: {
      svg(vnode, directiveMeta) {
        SvgSprite.ssr(vnode, directiveMeta)
      },
    },
  },
}
```

#### Nuxt (probably deprecated…)

If you are using this plugin with [Nuxt](https://nuxtjs.org/) make sure you import as a plugin without SSR since `document.createElementNS` does not exist.

```js
plugins: [
  { src: '~/plugins/svg-sprite.js', ssr: false }
]
```

## Usage

```html
<svg v-svg
     symbol="icons-dashboard"
     size="0 0 24 24"
     role="presentation"
     class="icon--inline"
></svg>
```

> you can use an expression rather than the `symbol` (`<svg v-svg="'icons-dashboard'"></svg>`).
> `size` attributes gives the same output with `"24"`, `"24 24"` or `"0 0 24 24"`.

output:

```html
<svg viewBox="0 0 24 24" width="24" height="24" role="presentation" class="icon--inline">
  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/svg/sprite.svg#icons-dashboard"></use>
</svg>
```

## Options

| Option | Values | Default | Description |
| --- | --- | --- | --- |
| url | String | '/assets/svg/sprite.svg' | path to external SVG file |
| class | String | 'icon' | CSS class name |

```js
Vue.use(SvgSprite, {
  url: 'path/to/svg/file.svg',
  class: 'my-class',
});
```

> If you want to use an inline SVG, set `url` option to `''`.

-----

> To generate the SVG sprite file, you can use [gulp-svgstore](https://github.com/w0rm/gulp-svgstore) or [grunt-svgstore](https://github.com/FWeinb/grunt-svgstore).

-----

[![NPM](https://nodei.co/npm/vue-svg-sprite.png)](https://www.npmjs.com/package/vue-svg-sprite) [![Greenkeeper badge](https://badges.greenkeeper.io/thierrymichel/vue-svg-sprite.svg)](https://greenkeeper.io/)

## Contributors

[@lovethebomb](https://github.com/lovethebomb)
[@eregnier](https://github.com/eregnier)
[@jpsc](https://github.com/jpsc)
[@valjar](https://github.com/valjar)
[@demiro](https://github.com/demiro)
[@Warin](https://github.com/Warin)
[@Warcot](https://github.com/Warcot)

## License

MIT, see [LICENSE.md](https://github.com/thierrymichel/vue-svg-sprite/blob/master/LICENSE) for details.
