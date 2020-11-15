import { App, defineComponent, computed } from 'vue'
import { SvgSpriteOptions, SvgSpritePluginOptions } from './defs'
import { getAttributes, getHref } from './utils'

const name = 'SvgSprite'
const options: SvgSpriteOptions = {} as SvgSpriteOptions
export const SvgSprite = defineComponent({
  name,
  template: `
  <svg
    :class="cssClass"
    :viewBox="attrs.viewBox"
    :width="attrs.width"
    :height="attrs.height"
    role="presentation"
  >
    <use xmlns:xlink="http://www.w3.org/1999/xlink"
      :xlink:href="href"
      :href="href"
    ></use>
  </svg>`,
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

    return {
      cssClass: options.class,
      href,
      attrs,
    }
  },
})

export const svgSpritePlugin = {
  install(app: App, opts: SvgSpritePluginOptions = {}) {
    // Get options
    options.class = opts.class || 'icon'
    options.url = opts.url === undefined ? '/assets/svg/sprite.svg' : opts.url

    app.component(name, SvgSprite)
  },
}
