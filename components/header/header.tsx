import * as React from "react"
import { HeaderProps } from "./header.props"
import {
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  ImageStyle, Platform, StatusBar,
  SafeAreaView
} from "react-native"
import { Icon } from "../icon"
import { Text } from "../text"
import { fonts, colors } from "../../theme"
import { translate } from "../../i18n/"
import { Layout } from "../../constants"

export const HEADER_HEIGHT = Platform.OS === "ios" ? Layout.window.height / 10 : Layout.window.height / 10

const ROOT: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.lightBlueTwo,
  height: HEADER_HEIGHT,
  marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  justifyContent: 'space-between',
  alignItems: 'center',
};

const TITLE: TextStyle = {
  textAlign: "center",
  fontFamily: fonts.GilmerBold,
  fontSize: 18,
  color: colors.header,
  lineHeight: 18
};

const TITLE_MIDDLE: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  width: "100%",
  height: "100%",
  bottom: 5,
  left: 0,
  zIndex: 1,
}

const SIDE: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3,
  height: 55,
  width: 55
}

const SIDE_LEFT: ViewStyle = {
  ...SIDE
}

const SIDE_TEXT: TextStyle = {
  fontFamily: fonts.GilmerLight,
  letterSpacing: 0.2,
  lineHeight: 16
}

const SIDE_RIGHT: ViewStyle = { ...SIDE }

const SIDE_ICON: ImageStyle = {
  height: 24,
  width: 24,
  bottom: 6
}

const SIDE_ICON_CONTAINER: ImageStyle = {

}

const SIDE_BLANK: ViewStyle = {
  flex: 1
}

const TWO_SIDES: ViewStyle = {
  width: '15%',
  alignItems: 'center',
}

const MIDDLE: ViewStyle = {
  width: '70%',
  alignItems: 'center',
}

export class Header extends React.PureComponent<HeaderProps, {}> {
  renderLeft = () => {
    const {
      leftView,
      leftIcon,
      leftText,
      leftTx,
      leftBody,
      onLeftPress,
      leftIconStyle = {},
      navigation: { goBack }
    } = this.props

    if (leftView) {
      return leftView
    } else if (leftText || leftTx) {
      return (
        <TouchableOpacity
          onPress={onLeftPress ? onLeftPress : () => goBack()}
          style={SIDE_LEFT}
        >
          <Text
            text={leftTx ? translate(leftTx) : leftText}
            style={SIDE_TEXT}
            preset="link"
          />
        </TouchableOpacity>
      )
    } else if (leftIcon) {
      return (
        <TouchableOpacity
          onPress={onLeftPress ? onLeftPress : () => goBack()}
          style={leftBody || SIDE_LEFT}
        >
          <Icon
            icon={leftIcon}
            style={{ ...SIDE_ICON, ...leftIconStyle }}
            containerStyle={SIDE_ICON_CONTAINER}
          />
        </TouchableOpacity>
      )
    } else {
      return <View style={SIDE_BLANK} />
    }
  }

  renderRight = () => {
    const {
      rightView,
      rightIcon,
      rightText,
      rightTx,
      onRightPress,
      rightIconStyle = {}
    } = this.props

    if (rightView) {
      return rightView
    } else if (rightText || rightTx) {
      return (
        <TouchableOpacity onPress={onRightPress} style={SIDE_RIGHT}>
          <Text
            text={rightTx ? translate(rightTx) : rightText}
            style={SIDE_TEXT}
            preset="link"
          />
        </TouchableOpacity>
      )
    } else if (rightIcon) {
      return (
        <TouchableOpacity onPress={onRightPress} style={SIDE_RIGHT}>
          <Icon
            icon={rightIcon}
            style={{ ...SIDE_ICON, ...rightIconStyle }}
            containerStyle={SIDE_ICON_CONTAINER}
          />
        </TouchableOpacity>
      )
    } else {
      return <View style={SIDE_BLANK} />
    }
  }

  render() {
    const { titleTx, titleStyle, title, middleView } = this.props

    return (
      <SafeAreaView style={{ ...ROOT, ...this.props.style }}>
        <StatusBar barStyle={"dark-content"} translucent backgroundColor={colors.lightBlueTwo} />

        <View
          style={TWO_SIDES}
        >
          {this.renderLeft()}
        </View>

        <View
          style={MIDDLE}
        >
          {
            title && title.length > 0 && (
              <View style={TITLE_MIDDLE}>
                <Text
                  style={{ ...TITLE, ...titleStyle }}
                  text={title || translate(titleTx)}
                >sdinsknd</Text>
              </View>
            )
          }

          {
            middleView && middleView
          }
        </View>

        <View
          style={TWO_SIDES}
        >
          {this.renderRight()}
        </View>

      </SafeAreaView>
    )
  }
}
