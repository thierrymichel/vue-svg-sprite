import { App, computed, defineComponent, h } from 'vue'
import { SvgSpriteOptions, SvgSpritePluginOptions } from './defs'
import { defaultOptions, getAttributes, getHref } from './utils'

const name = 'SvgSprite'
const options: SvgSpriteOptions = {
  ...defaultOptions,
}
export const SvgSprite = defineComponent({
  name,
  props: {
    symbol: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      validator: (s: string) => /^\d+( \d+( \d+ \d+)?)?$/.test(s),
    },
    url: String,
  },
  setup(props, { attrs: inheritAttrs }) {
    // No CSS class if already applied to component
    if (
      inheritAttrs.class &&
      (inheritAttrs.class as string).includes(options.class as string)
    ) {
      options.class = null
    }

    // HREF attributes
    const href = computed(() =>
      getHref(props.symbol, {
        ...options,
        // Override with "local" value without modifying the global one
        url: props.url === undefined ? options.url : props.url,
      })
    )
    // SVG attributes
    const attrs = computed(() => getAttributes(props.size))

    return () =>
      h(
        'svg',
        {
          role: 'presentation',
          class: options.class,
          width: attrs.value.width,
          height: attrs.value.height,
          viewBox: attrs.value.viewBox,
        },
        h('use', {
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          // eslint-disable-next-line quote-props
          href: href.value,
          'xlink-href': href.value,
        })
      )
  },
})

export const svgSpritePlugin = {
  install(app: App, opts: SvgSpritePluginOptions = {}) {
    // Update options
    options.class = opts.class === undefined ? defaultOptions.class : opts.class
    options.url = opts.url === undefined ? defaultOptions.url : opts.url

    app.component(name, SvgSprite)
  },
}
