import { ViewStyle, TextStyle, ImageStyle } from "react-native"
// import { NavigationScreenProps } from "react-navigation"

import { IconTypes } from "../icon"

export interface HeaderProps {
  /**
   * Main header, e.g. POWERED BY BOWSER
   */
  title?: string

  /**
   * header non-i18n
   */
  titleTx?: string

  /**
   * Icon that should appear on the left
   */
  leftIcon?: IconTypes

  /**
   * Style overrides for left icon
   */
  leftIconStyle?: ImageStyle

  /**
   * Style overrides for left icon
   */
  leftBody?: ViewStyle

  /**
   * View for left side passed in instead of an icon or text
   */
  leftView?: React.ReactNode

  /**
   * View for middle side passed in instead of an icon or text
   */
  middleView?: React.ReactNode

  /**
   * String for left button
   */
  leftText?: string

  /**
   * Translations key for left text
   */
  leftTx?: string

  /**
   * What happens when you press the left icon
   */
  onLeftPress?(): void

  /**
   * Icon that should appear on the right
   */
  rightIcon?: IconTypes

  /**
   * Style overrides for the right icon
   */
  rightIconStyle?: ImageStyle

  /**
   * View for right side passed in instead of an icon or text
   */
  rightView?: React.ReactNode

  /**
   * String for right button
   */
  rightText?: string

  /**
   * Translations key for right text
   */
  rightTx?: string

  /**
   * What happens when you press the right icon
   */
  onRightPress?(): void

  /**
   * Container style overrides.
   */
  style?: ViewStyle

  /**
   * Title style overrides.
   */
  titleStyle?: TextStyle
}
