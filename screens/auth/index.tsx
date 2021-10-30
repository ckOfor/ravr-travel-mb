// react
import React, { useEffect } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ImageBackground, ImageStyle, Image, ActivityIndicator
} from "react-native";

// third-party
import { Settings } from 'react-native-fbsdk-next';
import { LoginManager } from "react-native-fbsdk-next";
import { Profile } from "react-native-fbsdk-next";

// Setting the facebook app id using setAppID
// Remember to set CFBundleURLSchemes in Info.plist on iOS if needed
Settings.setAppID('563385481168762');
import * as AppleAuthentication from 'expo-apple-authentication';


// redux
import { googleAuthenticationSignInAsync, signInSignUp } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";

// util
import { translate } from "../../i18n";
import useReduxStore from "../../utils/hooks/useRedux";

const ROOT: ViewStyle = {
    height: Layout.window.height,
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.window.width,
    backgroundColor: colors.ravrPurple
};

const BACKGROUND_IMAGE: ImageStyle = {
    width: '100%',
    height: '100%',
}

const LOGO_VIEW: ImageStyle = {
    height: '10%',
    marginTop: Layout.window.height / 15,
}

const APP_LOGO: ImageStyle = {
    alignSelf: "flex-start",
    marginLeft: 20,
    height: 50,
    width: 50,
}

const SIGN_IN_VIEW: TextStyle = {
    height: '25%',
    marginTop: Layout.window.height / 20,
}

const SIGN_IN_TEXT: TextStyle = {
    fontSize: 22,
    marginLeft: 20,
    color: colors.white,
    fontFamily: fonts.RubikRegular,
    lineHeight: 40,
    textAlign: 'left',
    width: Layout.window.width / 1.3
}

const BUTTON: ViewStyle = {
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: Layout.window.width / 1.4,
    marginTop: 15,
    backgroundColor: '#97b9d2'
}

const BUTTON_LOGO: ImageStyle = {
    alignSelf: "center",
    height: 25,
    width: 25,
}

const FACEBOOK: ViewStyle = {
    ...BUTTON,
    backgroundColor: colors.white
}

const FACEBOOK_TEXT_STYLE: TextStyle = {
    marginLeft: 20,
    color: colors.ravrPurple,
}

const SOCIAL_VIEW: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
}

const orTextStyle: TextStyle = {
    fontFamily: fonts.RubikMedium,
    fontSize: 11,
    color: colors.white,
    textAlign: 'center',
    textTransform: 'uppercase'
}

const IMAGE_BUTTON: ViewStyle = {
    backgroundColor: colors.transparent,
    marginHorizontal: 20
}

const termsAndConditions: TextStyle = {
    fontSize: 14,
    marginLeft: 20,
    marginTop: Layout.window.height / 10,
    color: colors.white,
    fontFamily: fonts.RubikMedium,
    textAlign: 'left',
    width: Layout.window.width / 1.1
}



const Auth = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const isLoggedIn = selectStore('isLoggedIn')
    const isLoading = selectStore('loading')


    // PROPS

    // LIFECYCLE
    useEffect(() => {
        if (Platform.OS === "android" || !isLoggedIn) {
            StatusBar.setBackgroundColor(colors.ravrPurple)
            StatusBar.setBarStyle("light-content")
        }
    }, [])

    const facebookLogin = async () => {
        Settings.initializeSDK();

        LoginManager.logInWithPermissions(["public_profile"]).then(
            function (result) {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    console.log(
                        "Login success with permissions: " +
                        result.grantedPermissions.toString()
                    );

                    getProfile()
                }
            },
            function (error) {
                console.log("Login fail with error: " + error);
            }
        );
    }

    const getProfile = async () => {
        const result = await Profile.getCurrentProfile().then(
            function (currentProfile) {
                console.log(currentProfile)
                if (currentProfile) {
                    const payload = {
                        fullName: `${currentProfile.name}`,
                        email: currentProfile.email,
                        password: currentProfile.userID,
                        pictureURL: currentProfile.imageURL,
                        authType: 'facebook'
                    }

                    dispatch(signInSignUp(payload))
                }
            }
        );
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            behavior={"padding"}
            keyboardVerticalOffset={100}
        >
            <View
                style={ROOT}
            >
                <ImageBackground
                    source={images.authBackground}
                    style={BACKGROUND_IMAGE}
                    resizeMethod={'scale'}
                    resizeMode='cover'
                >

                    <View
                        style={LOGO_VIEW}
                    >
                        <Image
                            style={APP_LOGO}
                            source={images.appLogo}
                            resizeMethod={'auto'}
                            resizeMode='cover'
                        />
                    </View>

                    <View
                        style={SIGN_IN_VIEW}
                    >
                        <Text

                            style={SIGN_IN_TEXT}
                        >
                            {translate(`common.slogan`)}
                        </Text>
                    </View>

                    <View>
                        <Button
                            style={FACEBOOK}
                            onPress={() => navigation.navigate('EmailSignUp')}
                            disabled={isLoading}
                        >
                            {
                                isLoading
                                    ? <ActivityIndicator size="small" color={colors.ravrPurple} />
                                    : <Text style={FACEBOOK_TEXT_STYLE}>{translate(`auth.email`)}</Text>
                            }
                        </Button>

                        <View
                            style={SOCIAL_VIEW}
                        >
                            <Button
                                style={IMAGE_BUTTON}
                                onPress={() => facebookLogin()}
                                disabled={isLoading}
                            >
                                <Image
                                    style={BUTTON_LOGO}
                                    source={images.facebookLogo}
                                    resizeMethod={'auto'}
                                    resizeMode='cover'
                                />
                            </Button>

                            <Text

                                style={orTextStyle}
                            >
                                {translate(`auth.or`)}
                            </Text>

                            <Button
                                style={IMAGE_BUTTON}
                                onPress={() => dispatch(googleAuthenticationSignInAsync())}
                                disabled={isLoading}
                            >
                                <Image
                                    style={BUTTON_LOGO}
                                    source={images.googleLogo}
                                    resizeMethod={'auto'}
                                    resizeMode='cover'
                                />
                            </Button>


                        </View>

                        {
                            Platform.OS === "ios" && (
                                <AppleAuthentication.AppleAuthenticationButton
                                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                                    cornerRadius={5}
                                    style={{
                                        width: Layout.window.width / 1.4,
                                        height: 50,
                                        backgroundColor: colors.transparent,
                                        borderWidth: 2,
                                        borderColor: colors.white,
                                        borderRadius: 10,
                                        marginTop: 20,
                                        justifyContent: 'flex-end',
                                        alignSelf: 'center'
                                    }}
                                    onPress={async () => {
                                        try {
                                            const credential = await AppleAuthentication.signInAsync({
                                                requestedScopes: [
                                                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                                ],
                                            });
                                            // signed in

                                            const payload = {
                                                fullName: `${credential.fullName?.givenName} ${credential.fullName?.familyName}`,
                                                email: credential.email,
                                                password: credential.user,
                                                pictureURL: '',
                                                authType: 'apple'
                                            }

                                            console.log(credential)

                                            dispatch(signInSignUp(payload))
                                        } catch (e) {
                                            console.log(e, "ERROR")
                                            if (e.code === 'ERR_CANCELED') {
                                                // handle that the user canceled the sign-in flow
                                            } else {
                                                // handle other errors
                                            }
                                        }
                                    }}
                                />
                            )
                        }
                    </View>

                    <Text

                        style={termsAndConditions}
                    >
                        {translate(`auth.termsAndConditions`)}
                        <Text

                            style={termsAndConditions}
                        >
                            {translate(`auth.termsAndConditions_01`)}
                            <Text

                                style={termsAndConditions}
                            >
                                {translate(`auth.termsAndConditions_02`)}
                            </Text>
                        </Text>

                    </Text>


                </ImageBackground>


            </View>
        </KeyboardAvoidingView >
    )
}

export default Auth
