import * as React from "react"
import { TouchableOpacity, ActivityIndicator, View } from "react-native"
import { mergeAll, flatten } from "lodash/fp"
import { colors } from "../../theme"
import { Text } from "../text"
import { Icon } from "../icon"
import { viewPresets, textPresets, iconPresets } from "./button.presets"
import { ButtonProps } from "./button.props"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    preset = "primary",
    tx,
    txOptions,
    text,
    style: styleOverride,
    textStyle: textStyleOverride,
    children,
    loading,
    icon,
    iconStyle: iconStyleOverride,
    suffix,
    prefix,
    loadingText,
    loadingTextX,
    ...rest
  } = props

  let viewStyle = mergeAll(
    flatten([viewPresets[preset] || viewPresets.primary, styleOverride])
  )
  let iconStyle = mergeAll(
    flatten([iconPresets[preset] || iconPresets.primary, iconStyleOverride])
  )
  const textStyle = mergeAll(
    flatten([textPresets[preset] || textPresets.primary, textStyleOverride])
  )

  if (rest.disabled) {
    viewStyle = {
      ...viewStyle,
      opacity: 0.7,
      pointerEvents: "none"
    }
  }

  const content = children ? (
    children
  ) : Boolean(tx || text) ? (
    <Text tx={tx} text={text} txOptions={txOptions} style={textStyle} />
  ) : null

  const iconContent = icon ? <Icon icon={icon} style={iconStyle} /> : null

  return (
    <TouchableOpacity style={viewStyle} {...rest}>
      {loading ? (
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          {prefix}
          <Text tx={loadingTextX} text={loadingText} style={textStyle} />
          <ActivityIndicator 
            size="small" 
            color={colors.white} 
            style={{ 
              marginLeft: 20
            }} 
          />
        </View>
      ) : (
        <>
          {prefix}
          {iconContent}
          {content}
          {suffix}
        </>
      )}
    </TouchableOpacity>
  )
}
