import {
  ViewStyle,
  TextStyle,
  ImageStyle,
  TouchableOpacityProps
} from "react-native"
import { ButtonPresetNames } from "./button.presets"
import { IconTypes } from "../icon"

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: string

  /**
   * Boolean to disable button
   */
  disabled?: string

  /**
   * Text which is looked up via i18n.
   */
   loadingText?: string

  /**
   * Text which is looked up via i18n.
   */
  loadingTextX?: string

  /**
   * Component
   */
  prefix?: React.ReactNode

  /**
   * Component
   */
   suffix?: React.ReactNode
  
  /**
   * object which is looked up via i18n as options.
   */
  txOptions?: object

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  loading?: boolean

  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle | ViewStyle[]

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: TextStyle | TextStyle[]

  /**
   * One of the different types of text presets.
   */
  preset?: ButtonPresetNames
  /**
   * The icon to display
   */
  icon?: IconTypes
  /**
   * If you'd like to override the icons style.
   */
  iconStyle?: ImageStyle
  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode
}
