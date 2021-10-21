import * as React from "react"
import { View, TextInput, TextStyle, ViewStyle } from "react-native"
import { colors, fonts } from "../../theme"
import { translate } from "../../i18n"
import { Text } from "../text"
import { TextFieldProps } from "./text-field.props"
import { mergeAll, flatten } from "lodash/fp"
import {Layout} from "../../constants";

// the base styling for the container
const CONTAINER = (
  isInvalid: boolean = false,
  hasBorder: boolean = true
): ViewStyle => ({
  borderWidth: hasBorder ? 2 : 0,
  borderColor: isInvalid ? colors.ravrPurple : colors.white,
  borderRadius: 100,
  minWidth: Layout.window.width / 1.1,
  maxWidth: Layout.window.width / 1.1,
})

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: fonts.RubikRegular,
  color: colors.black,
  fontSize: 15,
  paddingHorizontal: 18,
  paddingVertical: 16,
  backgroundColor: colors.white,
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  borderColor: colors.transparent,
  elevation: 3,
  height: 50,
  borderRadius: 100
}

const FIELD_VALIDATION = (
  isInvalid: boolean = false,
  showRightAway: boolean = true
): TextStyle => ({
  marginTop: 4,
  paddingLeft: 18,
  marginBottom: 6,
  opacity: isInvalid ? 1 : 0,
  display: showRightAway ? "flex" : isInvalid ? "flex" : "none",
  color: 'red'
})

const LABEL: TextStyle = {
  paddingLeft: 18,
  marginBottom: 4,
  color: colors.black
}

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {}
}

const enhance = (style, styleOverride) => {
  return mergeAll(flatten([style, styleOverride]))
}

interface State {}

/**
 * A component which has a label and an input together.
 */
export class TextField extends React.Component<TextFieldProps, State> {
  render() {
    const {
      placeholderTx,
      placeholder,
      labelTx,
      labelTxOptions,
      textContentType,
      label,
      preset = "default",
      style: styleOverride,
      inputStyle: inputStyleOverride,
      forwardedRef,
      isInvalid,
      fieldError,
      padFieldForError = true,
      extraComponent,
      multiline,
      numberOfLines,
      keyboardType,
      ...rest
    } = this.props

    const shouldInvalid = isInvalid && !!fieldError

    let containerStyle: ViewStyle = {
      ...CONTAINER(shouldInvalid),
      ...PRESETS[preset]
    }
    containerStyle = enhance(containerStyle, styleOverride)

    let inputStyle: TextStyle = INPUT
    inputStyle = enhance(inputStyle, inputStyleOverride)
    const placeholderText = placeholderTx
      ? translate(placeholderTx)
      : placeholder

    const labelText = labelTx ? translate(labelTx,labelTxOptions) : label

    return (
      <>
        {Boolean(labelText) && (
          <Text preset="fieldLabel" text={labelText} style={LABEL} />
        )}
        <View style={containerStyle}>
          <TextInput
            clearButtonMode={"while-editing"}
            placeholder={placeholderText}
            placeholderTextColor={colors.blue1}
            underlineColorAndroid={colors.transparent}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
            multiline={multiline}
            style={inputStyle}
            ref={forwardedRef}
            {...rest}
            numberOfLines={numberOfLines}
            autoCorrect={false}
            textContentType={textContentType}
            keyboardType={keyboardType || "default"}
          />

          {Boolean(extraComponent) ? extraComponent : null}
        </View>
        <Text
          preset="fieldError"
          tx={shouldInvalid ? fieldError : null}
          style={FIELD_VALIDATION(isInvalid, padFieldForError)}
        />
      </>
    )
  }
}