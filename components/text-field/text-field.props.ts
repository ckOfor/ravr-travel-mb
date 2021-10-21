import { TextInputProps, TextStyle, ViewStyle } from "react-native"

export interface TextFieldProps extends TextInputProps {
  /**
   * Name prop for formik
   */
  name?: string

  /**
   * The placeholder i18n key.
   */
  placeholderTx?: string

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string

  onTouchEnd?: () => void

  /**
   * Field error label
   */
  fieldError?: any

  /**
   * The label text if no labelTx is provided.
   */
  label?: string

  /**
   * The label tx.
   */
  labelTx?: string
  
  /**
   * The label tx options.
   */
  labelTxOptions?: object

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: ViewStyle | ViewStyle[]

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: TextStyle | TextStyle[]

  /**
   * Various look & feels.
   */
  preset?: "default"

  /**
   * Callback for the input ref
   */
  forwardedRef?: (ref: any) => void

  /**
   * The validity of a text-field.
   */
  isInvalid?: boolean

  /**
   * Keyboard Type
   */
   keyboardType?: boolean

  /**
   * Should the text-field be pre-padded for errors?
   */
  padFieldForError?: boolean
  
  
  /**
   * Number of lines
   */
  numberOfLines?: number

  /**
   * Optional component to be displayed on the right side of the text-input
   */
  extraComponent?: React.ReactNode
  
  /**
   * Optional component to be displayed on the right side of the text-input
   */
  topComponent?: React.ReactNode
}
