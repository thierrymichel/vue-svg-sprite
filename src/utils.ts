import { SvgSpriteAttrs, SvgSpriteOptions } from './defs'

export const defaultOptions: SvgSpriteOptions = {
  class: 'icon',
  url: '/assets/svg/sprite.svg',
}
export const getHref = (id: string, options: SvgSpriteOptions) =>
  options.url === '' ? `#${id}` : `${options.url}#${id}`

export const checkClass = (classes: string, options: SvgSpriteOptions) => {
  const classToAdd = options.class as string

  /* eslint-disable indent */
  return classes
    ? classes.split(' ').some(className => {
        // Check for existing class option (also .className__block or .className--modifier)
        const [base] = className.split(/(-|_)/)

        return (
          base.indexOf(classToAdd) !== -1 && base.length === classToAdd.length
        )
      })
    : false
  /* eslint-enable indent */
}

export const getAttributes = (size?: string | number) => {
  const attrs: SvgSpriteAttrs = {
    height: null,
    width: null,
    viewBox: null,
  }

  if (!size) {
    return attrs
  }

  // Set viewBox, widht, height attributes ?
  // Normalize valid separators: / /, /,/
  const sizeValues = size
    .toString()
    .replace(/( |, |,)/g, ' ')
    .split(' ')
  const l = sizeValues.length

  if (l === 3 || l > 4) {
    console.warn(`[vue-svg-sprite] size: "${size}" is not valid`)

    return attrs
  }

  const viewBox = []
  viewBox[0] = l < 4 ? 0 : sizeValues[0]
  viewBox[1] = l < 4 ? 0 : sizeValues[1]
  /* eslint-disable no-multi-assign */
  attrs.width = viewBox[2] = l < 4 ? sizeValues[0] : sizeValues[2]
  attrs.height = viewBox[3] = sizeValues[l - 1]
  /* eslint-enable no-multi-assign */
  attrs.viewBox = viewBox.join(' ')

  return attrs
}
