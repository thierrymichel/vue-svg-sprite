import { App, Directive } from 'vue'
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
    const { size, url } = vnode.props as { size: string; url: string }

    // SVG attributes
    const attrs = getAttributes(size)

    attrs.viewBox && el.setAttribute('viewBox', attrs.viewBox)
    attrs.width && el.setAttribute('width', attrs.width)
    attrs.height && el.setAttribute('height', attrs.height)

    // Remove directive attributes
    id && el.removeAttribute('symbol')
    size && el.removeAttribute('size')

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

    // <use> has already been added server-side?
    const hasUseNode = el && el.querySelector('use') !== null

    /* istanbul ignore else */
    if (!hasUseNode) {
      // Add the <use> element to <svg>
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
      const href = getHref(id, {
        ...options,
        // Override with "local" value without modifying the global one
        url: url === undefined ? options.url : url,
      })

      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href)
      use.setAttribute('href', href)
      el.appendChild(use)
    }
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

      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
      use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href)
      use.setAttribute('href', href)

      el.replaceChild(use, useNode)
    }
  },
  /* istanbul ignore next */
  // Do not know who is usign this (and how)
  // at th emoment…
  // getSSRProps(binding, vnode) {
  //   const { symbol: id, size } = vnode.props
  // },
}

export const svgSpriteDirectivePlugin = {
  // TODO: make SSR work again…
  // No more VNodeDirective neither vnode…data, createElement
  // ssr /* istanbul ignore next */(vnode: VNode, directiveMeta: VNodeDirective) {
  //   // Get params
  //   const { data } = vnode
  //   const { symbol: id, size } = data.attrs

  //   // SVG attributes
  //   const attrs = getAttributes(size)

  //   if (attrs) {
  //     data.attrs = {
  //       ...data.attrs,
  //       ...attrs,
  //     }
  //   }

  //   // Remove directive attributes
  //   size && delete data.attrs.size
  //   id && delete data.attrs.symbol

  //   // SVG optional CSS class
  //   // We need to "concatenate" dynamic (object)
  //   // and static (space searated string) data
  //   const { class: dynamicClass, staticClass } = data
  //   let classes = staticClass || ''
  //   classes += dynamicClass ? Object.keys(dynamicClass).join(' ') : ''

  //   const hasClass = checkClass(classes)

  //   if (!hasClass) {
  //     data.staticClass = data.staticClass
  //       ? `${data.staticClass} ${options.class}`
  //       : options.class
  //   }

  //   // Add the <use> element to <svg>
  //   const use = vnode.context.$createElement('use', {
  //     attrs: {
  //       href: getHref(id, options),
  //     },
  //   })

  //   if (Array.isArray(vnode.children)) {
  //     vnode.children.push(use)
  //   } else {
  //     vnode.children = [use]
  //   }
  // },
  install(app: App, opts: SvgSpritePluginOptions = {}) {
    // Update options
    options.class = opts.class === undefined ? defaultOptions.class : opts.class
    options.url = opts.url === undefined ? defaultOptions.url : opts.url

    app.directive('svg', svgSpriteDirective)
  },
}
