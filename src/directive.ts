import { App, Directive, h, render, VNodeArrayChildren } from 'vue'
import { SvgSpriteOptions, SvgSpritePluginOptions } from './defs'
import { checkClass, defaultOptions, getAttributes, getHref } from './utils'

const options: SvgSpriteOptions = {
  ...defaultOptions,
}
export const svgSpriteDirective: Directive = {
  beforeMount(el, binding, vnode) {
    // Get params
    // If expression + "symbol" param -> use expression value
    const id: string = binding.value || vnode.props!.symbol
    const { size, url } = (vnode.props || {}) as { size: string; url: string }

    // SVG attributes
    const attrs = getAttributes(size)

    attrs.viewBox && el.setAttribute('viewBox', attrs.viewBox)
    attrs.width && el.setAttribute('width', attrs.width)
    attrs.height && el.setAttribute('height', attrs.height)

    // Remove directive attributes
    id && el.removeAttribute('symbol')
    size && el.removeAttribute('size')
    url && el.removeAttribute('url')

    // SVG optional CSS class
    // IE do not support classList on SVG element, so we use getAttribute…
    const classes = el.getAttribute('class')
    const hasClass = checkClass(classes, options)

    if (!hasClass) {
      el.setAttribute(
        'class',
        classes ? `${classes} ${options.class}` : options.class
      )
    }

    const children: VNodeArrayChildren = []
    // <use> has already been added server-side?
    const hasUseNode = el && el.querySelector('use') !== null

    /* istanbul ignore else */
    if (!hasUseNode) {
      // Add the <use> element to <svg>
      const href = getHref(id, {
        ...options,
        // Override with "local" value without modifying the global one
        url: url === undefined ? options.url : url,
      })
      const use = h('use', {
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        // eslint-disable-next-line quote-props
        href,
        'xlink-href': href,
      })

      children.push(use)
    }

    // Render full SVG (no more document.createElement)
    const svg = h(
      'svg',
      {
        class: classes ? `${classes} ${options.class}` : options.class,
      },
      children
    )
    render(svg, el)
  },
  updated(el, binding, vnode) {
    // NOTE: guess it's only when expression is used…
    const id = binding.value || vnode.props!.symbol
    const { url } = vnode.props as { url: string }
    const href = getHref(id, {
      ...options,
      // Override with "local" value without modifying the global one
      url: url === undefined ? options.url : url,
    })
    const useNode = el && el.querySelector('use')

    /* istanbul ignore else */
    if (useNode) {
      // Skip replacement if href is the same
      /* istanbul ignore if */
      if ((useNode as Element).getAttribute('href') === href) {
        return
      }

      useNode.setAttribute('href', href)
      useNode.setAttribute('xlink-href', href)
    }
  },
  /* istanbul ignore next */
  // Do not know who is usign this (and how)
  // at the moment…
  // getSSRProps(binding, vnode) {
  //   const { symbol: id, size } = vnode.props
  // },
}

export const svgSpriteDirectivePlugin = {
  install(app: App, opts: SvgSpritePluginOptions = {}) {
    // Update options
    options.class = opts.class === undefined ? defaultOptions.class : opts.class
    options.url = opts.url === undefined ? defaultOptions.url : opts.url

    app.directive('svg', svgSpriteDirective)
  },
}
