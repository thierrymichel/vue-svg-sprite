export default {
  install(Vue, opts = {}) {

    const dir = {
      params: ['symbol', 'size'],
      bind(el, binding, vnode, oldVnode) {

        // Get options
        opts.class = opts.class || 'icon';
        opts.url = opts.url || '/assets/svg/sprite.svg';

        // Get params
        // If expression + "symbol" param -> use expression
        let id = vnode.data.attrs.expression || vnode.data.attrs.symbol;
        let size = vnode.data.attrs.size;

        // Get element
        // Set viewBox, widht, height attributes ?
        if (size) {
          // Normalize valid separators: / /, /,/
          size = size.replace(/( |, |,)/g, ' ');
          let sizeValues = size.split(' ');
          let l = sizeValues.length;
          let viewBox = [];

          if (l === 3 || l > 4) {
            console.warn('[vue-svg-sprite] size: ', size,' is not valid');
          } else {
            viewBox[0] = (l < 4) ? 0 : sizeValues[0];
            viewBox[1] = (l < 4) ? 0 : sizeValues[1];
            let w = viewBox[2] = (l < 4) ? sizeValues[0] : sizeValues[2];
            let h = viewBox[3] = sizeValues[l - 1];

            el.setAttribute('viewBox', viewBox.join(' '));
            el.setAttribute('width', w);
            el.setAttribute('height', h);
          }
        }

        // Check for existing class option (also .className--modifier)
        let isClassExisting = false;

        for (let i = 0; i < el.classList.length; i++) {
          if (el.classList.item(i).indexOf(opts.class) !== -1) {
            isClassExisting = true;
          }
        }

        if (!isClassExisting) {
          el.classList.add(opts.class);
        }

        // Add the <use> element to <svg>
        let href = opts.url + '#' + id;
        let use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
        el.appendChild(use);
      },
    };

    Vue.directive('svg', dir);
  },
};
