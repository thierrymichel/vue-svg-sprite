import _Vue, { DirectiveOptions } from 'vue';

interface ISvgSpriteOptions {
  class?: string;
  url?: string;
}

/* eslint-disable no-magic-numbers */
export default {
  install(vue: typeof _Vue, opts: ISvgSpriteOptions = {}) {
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    const dir: DirectiveOptions = {
      bind(el, binding, vnode) {
        // Get options
        opts.class = opts.class || 'icon';
        opts.url = opts.url === undefined ? '/assets/svg/sprite.svg' : opts.url;

        // Get params
        // If expression + "symbol" param -> use expression value
        const id: string = binding.value || vnode.data.attrs.symbol;
        let size: string = vnode.data.attrs && vnode.data.attrs.size;

        // Set viewBox, widht, height attributes ?
        if (size) {
          // Normalize valid separators: / /, /,/
          size = size.replace(/( |, |,)/g, ' ');
          const sizeValues = size.split(' ');
          const l = sizeValues.length;
          const viewBox = [];

          if (l === 3 || l > 4) {
            console.warn(`[vue-svg-sprite] size: "${size}" is not valid`);
          } else {
            viewBox[0] = l < 4 ? 0 : sizeValues[0];
            viewBox[1] = l < 4 ? 0 : sizeValues[1];
            /* eslint-disable no-multi-assign */
            const w = viewBox[2] = l < 4 ? sizeValues[0] : sizeValues[2];
            const h = viewBox[3] = sizeValues[l - 1];
            /* eslint-enable no-multi-assign */

            el.setAttribute('viewBox', viewBox.join(' '));
            el.setAttribute('width', w);
            el.setAttribute('height', h);
            // Remove directive attributes
            el.removeAttribute('size');
            el.removeAttribute('symbol');
          }
        }

        // Check for existing class option (also .className--modifier)
        // IE do not support classList on SVG element, so we use getAttribute…
        const classes = el.getAttribute('class');
        const hasClass = classes ?
          classes.split(' ').some(className => className.indexOf(opts.class) !== -1) :
          false;

        if (!hasClass) {
          el.setAttribute('class', classes ? `${classes} ${opts.class}` : opts.class);
        }

        // Add the <use> element to <svg>
        const href = opts.url === '' ? `#${id}` : `${opts.url}#${id}`;
        const useEl = use.cloneNode() as SVGUseElement;

        useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
        useEl.setAttribute('href', href);
        el.appendChild(useEl);
      },
      update(el, binding, vnode) {
        // NOTE: guess it's only when expression is used…
        const id = binding.value || vnode.data.attrs.symbol;
        const href = opts.url === '' ? `#${id}` : `${opts.url}#${id}`;

        if (
          el
          && el.childNodes
          && el.childNodes[0]
          && (el.childNodes[0] as Element).getAttribute('href') === href
        ) {
          return false;
        }

        const useEl = use.cloneNode() as SVGUseElement;

        useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
        useEl.setAttribute('href', href);
        el.replaceChild(useEl, el.childNodes[0]);
        return true;
      },
    };

    vue.directive('svg', dir);
  },
};
