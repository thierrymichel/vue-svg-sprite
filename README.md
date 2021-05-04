# vue-svg-sprite

![stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat-square)
[![NPM version](https://img.shields.io/npm/v/vue-svg-sprite.svg?style=flat-square)](https://www.npmjs.com/package/vue-svg-sprite)
[![Coverage Status](https://img.shields.io/coveralls/thierrymichel/vue-svg-sprite/master.svg?style=flat-square)](https://coveralls.io/github/thierrymichel/vue-svg-sprite?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![License](https://img.shields.io/badge/license-UNLICENSE-green.svg?style=flat-square)](https://github.com/thierrymichel/vue-svg-sprite/blob/master/UNLICENSE)

> Vue.js component or directive to simply use SVG sprites

🚨 This new version (2.x) is for Vue.js 3. For v2 compatibility, check [previous version](https://www.npmjs.com/package/vue-svg-sprite/v/1.4.3)

## Description

This Vue.js plugin will help you to manage SVG spritsheet with `<symbol>` elements.
It provides a component / directive to make tu use of `<svg>` and `<use>` elements easier.

This module is tree-shakable and exports the followings:

- `SvgSprite`, the component version (with a **S**)
- `svgSpritePlugin`, options and global registration for component
- `svgSpriteDirective`, the directive version
- `svgSpriteDirectivePlugin`, options and global registration for directive

> 820B gzipped for the component plugin…

It's also TypeScript friendly :)

### Overall usage

- Use inline SVG spritesheet or an external SVG file
- Use `symbol` attribute (or directive expression) to get the right `<symbol>`
- Use `size` attribute for `viewBox`, `width` and `height` (`<svg>`)
  - Comma or space separated values
  - 1, 2 or 4 values accepted
  - 1 value: x/y = 0, width = height (e.g.: 24)
  - 2 values: x/y = 0, width, height (e.g.: 24 24)
  - 4 values: x, y, width, height (e.g.: 0 0 24 24)
- Use `url` attribute to override global option value
- **Options** (with plugin use):
  - `url`: path to external SVG file (default: `/assets/svg/sprite.svg`, use `''` for inline)
  - `class`: class for the SVG element (default: `icon`)

NB: If the className is already used (eg: via a modifier like `icon--inline`), the class option is not added…

---

## Setup

### Component (plugin + local)

```js
// File: main.ts
// Global registration with options
import Vue from 'vue'
import { svgSpritePlugin } from 'vue-svg-sprite'

Vue.use(svgSpritePlugin, {} /* options */)
```

```html
<script>
  // File: Parent.vue
  // Local use
  import { SvgSprite } from 'vue-svg-sprite'

  export default {
    components: {
      SvgSprite,
    },
  }
</script>
```

### Directive (plugin)

```js
// File: main.ts
// Global registration with options
import Vue from 'vue'
import { svgSpriteDirectivePlugin } from 'vue-svg-sprite'

Vue.use(svgSpriteDirectivePlugin, {} /* options */)
```

### Options

| Option | Default                  | Description               |
| ------ | ------------------------ | ------------------------- |
| url    | '/assets/svg/sprite.svg' | path to external SVG file |
| class  | 'icon'                   | CSS class name            |

```js
Vue.use(svgSpritePlugin, {
  url: 'path/to/svg/file.svg',
  class: 'my-class',
})
```

> If you want to use an inline SVG, set `url` to `''`.
> 
> If you use vue-cli, set `url` to `require('./assets/svg/sprite.svg')`.

---

## Usage

### Component

```html
<SvgSprite symbol="icons-dashboard" size="24" />
```

### Directive

```html
<svg v-svg symbol="icons-dashboard" size="24"></svg>
```

> You can also use an expression (`<svg v-svg="'icons-dashboard'"></svg>`).

### Attributes (all)

| Attribute | Required | Default       | Description                              |
| --------- | -------- | ------------- | ---------------------------------------- |
| symbol    | \*       | -             | symbol id                                |
| size      |          | -             | generate `viewBox`, `width` and `height` |
| url       |          | `options.url` | href domain or `''` for inline SVG       |

> `size` attributes gives the same output with `24`, `24 24` or `0 0 24 24`.

### Example

```html
<SvgSprite
  symbol="icons-dashboard"
  size="0 0 24 24"
  role="presentation"
  class="icon--inline"
/>
```

#### output

```html
<svg
  viewBox="0 0 24 24"
  width="24"
  height="24"
  role="presentation"
  class="icon--inline"
>
  <use
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xlink:href="/assets/svg/sprite.svg#icons-dashboard"
    href="/assets/svg/sprite.svg#icons-dashboard"
  ></use>
</svg>
```

> To generate the SVG sprite file, you can use [svg-sprite](https://www.npmjs.com/package/svg-sprite).

---

## Contributors

[@lovethebomb](https://github.com/lovethebomb)
[@eregnier](https://github.com/eregnier)
[@jpsc](https://github.com/jpsc)
[@valjar](https://github.com/valjar)
[@demiro](https://github.com/demiro)
[@Warin](https://github.com/Warin)
[@Warcot](https://github.com/Warcot)

## License

See [UNLICENSE](https://github.com/thierrymichel/vue-svg-sprite/blob/master/UNLICENSE) for details.
