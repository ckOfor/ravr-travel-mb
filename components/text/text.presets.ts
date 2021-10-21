import { TextStyle } from "react-native"
import { colors, fonts } from "../../theme"

/**
 * All text will start off looking like this.
 */
const BASE: TextStyle = {
  fontFamily: fonts.gibsonBold,
  color: colors.white,
  fontSize: 15,
  lineHeight: 20
}

const HEADER: TextStyle = {
  ...BASE,
  fontFamily: fonts.gibsonBold
}

const HEADER_EXTRABOLD: TextStyle = {
  ...HEADER,
  fontFamily: fonts.gibsonBold
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const presets = {
  /**
   * The default text styles.
   */
  default: BASE,

  /**
   * A bold version of the default text.
   */
  bold: { ...BASE, fontFamily: fonts.gibsonBold } as TextStyle,

  /**
   * A small version of the default text.
   */
  small: { ...BASE, fontSize: 14 } as TextStyle,

  /**
   * A small version of the default text.
   */
  xsmall: { ...BASE, fontSize: 12 } as TextStyle,

  /**
   * Large headers.
   */
  h1: { ...HEADER_EXTRABOLD, fontSize: 22, lineHeight: 30 } as TextStyle,

  /**
   * Medium headers.
   */
  h2: { ...HEADER, fontSize: 19 } as TextStyle,

  /**
   * Small headers.
   */
  h3: { ...HEADER_EXTRABOLD, fontSize: 17 } as TextStyle,

  /**
   * Link (Clickable)
   */
  link: {
    ...BASE,
    letterSpacing: 0.2
  } as TextStyle,
  /**
   * Field labels that appear on forms above the inputs.
   */
  fieldLabel: { ...BASE, fontSize: 14 } as TextStyle,

  /**
   * Error text for a field.
   */
  fieldError: {
    ...BASE,
    fontSize: 14,
    color: colors.error,
    lineHeight: 15
  } as TextStyle
}

/**
 * A list of preset names.
 */
export type TextPresets = keyof typeof presets
