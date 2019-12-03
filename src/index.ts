import _Vue, { DirectiveOptions, VNode, VNodeDirective } from 'vue';

interface ISvgSpriteOptions {
  class?: string;
  url?: string;
}

/* eslint-disable no-magic-numbers */
export default {
  options: {} as ISvgSpriteOptions,
  // TODO: add tests for SSR
  ssr/* istanbul ignore next */(vnode: VNode, directiveMeta: VNodeDirective) {
    // Get params
    const { data } = vnode;
    const { symbol: id, size } = data.attrs;

    // SVG attributes
    const attrs = this.getAttributes(size);

    if (attrs) {
      data.attrs = {
        ...data.attrs,
        ...attrs,
      };
    }

    // Remove directive attributes
    size && delete data.attrs.size;
    id && delete data.attrs.symbol;

    // SVG optional CSS class
    // We need to "concatenate" dynamic (object)
    // and static (space searated string) data
    const { class: dynamicClass, staticClass } = data;
    let classes = staticClass || '';
    classes += dynamicClass ? Object.keys(dynamicClass).join(' ') : '';

    const hasClass = this.hasClass(classes);

    if (!hasClass) {
      data.staticClass = data.staticClass
        ? `${data.staticClass} ${this.options.class}`
        : this.options.class;
    }

    // Add the <use> element to <svg>
    const use = vnode.context.$createElement('use', {
      attrs: {
        href: this.getHref(id),
      },
    });

    if (Array.isArray(vnode.children)) {
      vnode.children.push(use);
    } else {
      vnode.children = [use];
    }
  },
  install(vue: typeof _Vue, opts: ISvgSpriteOptions = {}) {
    // Get options
    this.options.class = opts.class || 'icon';
    this.options.url = opts.url === undefined ? '/assets/svg/sprite.svg' : opts.url;

    const self = this;

    const dir: DirectiveOptions = {
      bind(el, binding, vnode) {
        // Get params
        // If expression + "symbol" param -> use expression value
        const id: string = binding.value || vnode.data.attrs.symbol;
        const size: string = vnode.data.attrs && vnode.data.attrs.size;

        // SVG attributes
        const attrs = self.getAttributes(size);

        if (attrs) {
          el.setAttribute('viewBox', attrs.viewBox);
          el.setAttribute('width', attrs.width);
          el.setAttribute('height', attrs.height);
        }

        // Remove directive attributes
        id && el.removeAttribute('symbol');
        size && el.removeAttribute('size');

        // SVG optional CSS class
        // IE do not support classList on SVG element, so we use getAttribute…
        const classes = el.getAttribute('class');
        const hasClass = self.hasClass(classes);

        if (!hasClass) {
          el.setAttribute('class', classes ? `${classes} ${self.options.class}` : self.options.class);
        }

        // Add the <use> element to <svg>
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        const href = self.getHref(id);

        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
        use.setAttribute('href', href);
        el.appendChild(use);
      },
      update(el, binding, vnode) {
        // NOTE: guess it's only when expression is used…
        const id = binding.value || vnode.data.attrs.symbol;
        const href = self.getHref(id);
        const useNode = el && el.querySelector('use');

        /* istanbul ignore else */
        if (useNode) {
          // Skip replacement if href is the same
          /* istanbul ignore if */
          if ((useNode as Element).getAttribute('href') === href) {
            return false;
          }

          const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
          use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
          use.setAttribute('href', href);

          el.replaceChild(use, useNode);
        }
      },
    };

    vue.directive('svg', dir);
  },
  getAttributes(size: string) {
    if (!size) {
      return null;
    }

    // Set viewBox, widht, height attributes ?
    // Normalize valid separators: / /, /,/
    const sizeValues = size.replace(/( |, |,)/g, ' ').split(' ');
    const l = sizeValues.length;

    if (l === 3 || l > 4) {
      console.warn(`[vue-svg-sprite] size: "${size}" is not valid`);
      return null;
    }

    const viewBox = [];
    viewBox[0] = l < 4 ? 0 : sizeValues[0];
    viewBox[1] = l < 4 ? 0 : sizeValues[1];
    /* eslint-disable no-multi-assign */
    const width = viewBox[2] = l < 4 ? sizeValues[0] : sizeValues[2];
    const height = viewBox[3] = sizeValues[l - 1];
    /* eslint-enable no-multi-assign */

    return {
      height,
      viewBox: viewBox.join(' '),
      width,
    };
  },
  hasClass(classes: string) {
    const classToAdd = this.options.class;

    return classes
    ? classes
    .split(' ')
    .some(className => {
        // Check for existing class option (also .className__block or .className--modifier)
        const base = className.split(/(-|_)/)[0];
        return base.indexOf(classToAdd) !== -1 && base.length === classToAdd.length;
      })
    : false;
  },
  getHref(id: string) {
    return this.options.url === '' ? `#${id}` : `${this.options.url}#${id}`;
  },
};
