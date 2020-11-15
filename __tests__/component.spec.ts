import { nextTick, ComponentOptionsWithoutProps } from 'vue'
import { mount } from '@vue/test-utils'
import { svgSpritePlugin, SvgSpriteOptions } from '../src'

const defaultClassName = 'icon'
const defaultUrl = '/assets/svg/sprite.svg'

const className = ''
const height = 24
const width = 48
const size = `0 0 ${width} ${height}`
const symbol = 'icon1'

// The component to test
const SvgComponent = {
  template: `<div>
<SvgSprite
  :class="className"
  :size="size"
  :symbol="symbol"
  :url="url"
  role="presentation"></SvgSprite>
</div>`,
  data() {
    return {
      className,
      size,
      symbol,
      url: undefined,
    }
  },
}

interface ComponentData {
  className?: string
  directive?: string
  size?: string | number
  symbol?: string
  url?: string
}

const getWrapper = (
  data: ComponentData = {},
  opts?: SvgSpriteOptions,
  cpt: ComponentOptionsWithoutProps = SvgComponent
) => {
  const wrapper = mount(cpt, {
    data() {
      return {
        ...data,
      }
    },
    global: {
      plugins: [[svgSpritePlugin, opts]],
    },
  })
  const svg = wrapper.find('svg')
  const use = svg.get('use')

  return { svg, use, wrapper }
}

test('defaults', () => {
  const { svg, use } = getWrapper()

  expect(svg.exists()).toBeTruthy()
  expect(svg.attributes('role')).toBe('presentation')
  expect(svg.attributes('viewBox')).toBe(size)
  expect(svg.attributes('width')).toBe(width.toString())
  expect(svg.attributes('height')).toBe(height.toString())
  expect(svg.attributes('class')).toBe(defaultClassName)

  expect(use.exists()).toBeTruthy()
  expect(use.attributes('href')).toBe(`${defaultUrl}#${symbol}`)
  // TODO: check xlink…
  // expect(use.attributes('xlink:href')).toBe(`${defaultUrl}#${symbol}`)
})

test('symbol prop is required', () => {
  global.console.warn = jest.fn()
  getWrapper({}, undefined, {
    template: '<SvgSprite />',
  })

  expect(global.console.warn).toHaveBeenCalledTimes(1)
})

test('add use href with symbol prop', () => {
  const { use } = getWrapper()

  expect(use.attributes('href')).toBe(`${defaultUrl}#${symbol}`)
})

test('use directive with custom options', () => {
  const url = ''
  const altClassName = 'pic'
  const { svg, use } = getWrapper({}, { url, class: 'pic' })

  expect(svg.attributes('class')).toBe(altClassName)
  expect(use.attributes('href')).toBe(`${url}#${symbol}`)
})

test('prefer custom url prop', () => {
  const url = 'custom'
  const { use } = getWrapper({ url })

  expect(use.attributes('href')).toBe(`${url}#${symbol}`)
})

test('add size attribute, 4 values', () => {
  const { svg } = getWrapper()

  expect(svg.attributes('viewBox')).toBe(size)
  expect(svg.attributes('width')).toBe(width.toString())
  expect(svg.attributes('height')).toBe(height.toString())
})

test('add size attribute, 2 values', () => {
  const { svg } = getWrapper({ size: `${width} ${height}` })

  expect(svg.attributes('viewBox')).toBe(size)
  expect(svg.attributes('width')).toBe(width.toString())
  expect(svg.attributes('height')).toBe(height.toString())
})

test('add size attribute, 1 value', () => {
  const height = width
  const size = `0 0 ${width} ${height}`
  const { svg } = getWrapper({ size: `${width}` })

  expect(svg.attributes('viewBox')).toBe(size)
  expect(svg.attributes('width')).toBe(width.toString())
  expect(svg.attributes('height')).toBe(height.toString())
})

test('add size attribute, 1 number', () => {
  const height = width
  const size = `0 0 ${width} ${height}`
  const { svg } = getWrapper({ size: width })

  expect(svg.attributes('viewBox')).toBe(size)
  expect(svg.attributes('width')).toBe(width.toString())
  expect(svg.attributes('height')).toBe(height.toString())
})

test('add invalid size attribute, no values', () => {
  global.console.warn = jest.fn()
  const size = undefined
  const { svg } = getWrapper({ size })

  expect(svg.attributes('viewBox')).toBeUndefined()
  expect(svg.attributes('width')).toBeUndefined()
  expect(svg.attributes('height')).toBeUndefined()
  expect(global.console.warn).not.toHaveBeenCalled()
})

test('add invalid size attribute, 3 values', () => {
  global.console.warn = jest.fn()
  const size = '6 12 42'
  const { svg } = getWrapper({ size })

  expect(svg.attributes('viewBox')).toBeUndefined()
  expect(svg.attributes('width')).toBeUndefined()
  expect(svg.attributes('height')).toBeUndefined()
  expect(global.console.warn).toHaveBeenCalledTimes(2) // Plugin + Vue
})

test('add invalid size attribute, 5 values', () => {
  global.console.warn = jest.fn()
  const size = '3 6 12 24 42'
  const { svg } = getWrapper({ size })

  expect(svg.attributes('viewBox')).toBeUndefined()
  expect(svg.attributes('width')).toBeUndefined()
  expect(svg.attributes('height')).toBeUndefined()
  expect(global.console.warn).toHaveBeenCalledTimes(2) // Plugin + Vue
})

test('add default classname', () => {
  const { svg } = getWrapper()

  expect(svg.attributes('class')).toBe(defaultClassName)
})

test('do not ovewrite default classname', () => {
  const className = 'icon--inline'
  const { svg } = getWrapper({ className })

  expect(svg.attributes('class')).toBe(className)
})

test('keep classnames', () => {
  const className = 'foo bar'
  const { svg } = getWrapper({ className })

  expect(svg.attributes('class')).toBe(`${defaultClassName} ${className}`)
})

test('do not ovewrite + keep classnames', () => {
  const className = 'icon--inline foo bar'
  const { svg } = getWrapper({ className })

  expect(svg.attributes('class')).toBe(className)
})

test('keep attribute', () => {
  const { svg } = getWrapper()

  expect(svg.attributes('role')).toBe('presentation')
})

test('update use href with symbol property', async () => {
  const { use, wrapper } = getWrapper()
  const newSymbol = 'icon2'

  expect(use.exists()).toBeTruthy()
  expect(use.attributes('href')).toBe(`${defaultUrl}#${symbol}`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(wrapper.vm as any).symbol = newSymbol

  await nextTick()

  const updatedUse = wrapper.find('use')

  expect(updatedUse.exists()).toBeTruthy()
  expect(updatedUse.attributes('href')).toBe(`${defaultUrl}#${newSymbol}`)
})
