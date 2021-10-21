import { colors, ColorKeys } from "./colors"
import { fonts, FontKeys } from "./fonts"

export interface ITheme {
  colors: { [key in ColorKeys]: string }
  fonts: { [key in FontKeys]: string }
  fontSizes: number[]
  lineHeights: number[]
  space: number[]
}

export const theme: ITheme = {
  colors,
  fonts,

  fontSizes: [10, 12, 14, 16, 18, 22, 24, 30, 36, 48],
  lineHeights: [18, 24, 28, 36, 48],

  space: [0, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44]
}
