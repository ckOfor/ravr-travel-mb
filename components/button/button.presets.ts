import { ViewStyle, TextStyle, ImageStyle } from "react-native"
import { colors, fonts } from "../../theme"

/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  paddingVertical: 10,
  // paddingHorizontal: 14,
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row"
}

const BASE_TEXT: TextStyle = {
  fontSize: 15,
  fontFamily: fonts.FilsonProRegular,
  lineHeight: 18,
  letterSpacing: 0.2
}

const BASE_ICON: ImageStyle = {
  tintColor: "white",
  width: 18,
  height: 18,
  marginRight: 12
}
/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const viewPresets = {
  /**
   * The primary style.
   */
  primary: { ...BASE_VIEW, backgroundColor: colors.white } as ViewStyle,
  /**
   * The secondary style
   */
  secondary: {
    ...BASE_VIEW,
    borderColor: colors.white,
    backgroundColor: colors.transparent,
    borderWidth: 1
  } as ViewStyle,
  /**
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "flex-start"
  } as ViewStyle
}

export const textPresets = {
  primary: {
    ...BASE_TEXT,
    color: colors.text
  } as TextStyle,
  secondary: {
    ...BASE_TEXT,
    color: colors.white
  } as TextStyle,
  link: {
    ...BASE_TEXT,
    color: colors.white,
    paddingHorizontal: 0,
    paddingVertical: 0
  } as TextStyle
}

export const iconPresets = {
  primary: {
    ...BASE_ICON
  } as ImageStyle,
  secondary: {
    ...BASE_ICON,
    tintColor: colors.white
  } as ImageStyle,
  link: {
    ...BASE_ICON,
    marginRight: 7
  } as ImageStyle
}

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof viewPresets
