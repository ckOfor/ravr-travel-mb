// react
import React, { useEffect, useRef, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ImageBackground, ImageStyle, Image, ActivityIndicator, Alert, ScrollView, TouchableOpacity
} from "react-native";

// third-party
import { Settings } from 'react-native-fbsdk-next';
import { LoginManager } from "react-native-fbsdk-next";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import firebase from 'react-native-firebase';

// Setting the facebook app id using setAppID
// Remember to set CFBundleURLSchemes in Info.plist on iOS if needed
Settings.setAppID('563385481168762');


// redux

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";

// util
import { translate } from "../../i18n";
import useReduxStore from "../../utils/hooks/useRedux";
import { signInSignUp } from "../../redux/auth";

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
    marginTop: Layout.window.height / 10,
}

const APP_LOGO: ImageStyle = {
    alignSelf: "flex-start",
    marginLeft: 20,
    height: 50,
    width: 50,
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


const termsAndConditions: TextStyle = {
    fontSize: 14,
    marginLeft: 20,
    marginTop: 20,
    color: colors.white,
    fontFamily: fonts.RubikMedium,
    textAlign: 'left',
    width: Layout.window.width / 1.1
}

const FIELD: ViewStyle = {
    alignItems: 'center'
}

const CONTINUE_BUTTON: ViewStyle = {
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: Layout.window.width / 1.4,
    marginTop: 25,
    backgroundColor: colors.ravrPurple
}

const CONTINUE_BUTTON_TEXT: TextStyle = {
    fontSize: 12,
    fontFamily: fonts.RubikRegular,
    color: colors.white,
    textTransform: 'uppercase'
}

const BOTTOM_TEXT: TextStyle = {
    fontSize: 14,
    marginLeft: 20,
    marginTop: Layout.window.height / 5,
    color: colors.white,
    fontFamily: fonts.RubikRegular,
    textAlign: 'left',
    width: Layout.window.width / 1.5
}


const FORGOT_PASSWORD_LINK_BUTTON: ViewStyle = {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginRight: Layout.window.width / 2.5
}

const FORGOT_PASSWORD__LINK_TEXT: TextStyle = {
    // color: colors.blue1,
    paddingLeft: 18,
    fontSize: 12,
    fontFamily: fonts.RubikRegular,
    textTransform: 'uppercase'
}

const schema = Yup.object().shape({
    email: Yup.string()
        .email("common.fieldValidEmail")
        .required("common.fieldRequired"),
})

interface MyFormValues {
    email: string
    password: string
}

const EmailSignIn = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const isLoggedIn = selectStore('isLoggedIn')
    const isLoading = selectStore('loading')


    // PROPS
    let emailInput = useRef(null)
    let passwordInput = useRef(null)

    // LIFECYCLE
    useEffect(() => {
        if (Platform.OS === "android" || !isLoggedIn) {
            StatusBar.setBackgroundColor(colors.ravrPurple)
            StatusBar.setBarStyle("light-content")
        }
    }, [])

    const submit = values => {
        const { email, password } = values;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((data) => {
                // If you need to do anything with the user, do it here
                // The user will be logged in automatically by the 
                // `onAuthStateChanged` listener we set up in App.js earlier
                const paylaod = {
                    email,
                    password,
                    authType: 'email'
                }

                console.log(data.user.emailVerified)

                if (!data.user.emailVerified) {
                    firebase.auth().onAuthStateChanged(function (user) {
                        user.sendEmailVerification();
                    });
                    Alert.alert(
                        'Success', `${translate('emailSignIn.verificationSent', {
                            email
                        })}`,
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false },
                    );
                } else {
                    console.log('OK Pressed')
                    dispatch(signInSignUp(paylaod))
                }
            })
            .catch((error) => {
                const { code, message } = error;
                // For details of error codes, see the docs
                // The message contains the default Firebase string
                // representation of the error
                Alert.alert(
                    'Error', message,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
            });
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{
                    height: '100%',
                }}
                bounces={false}
            >
                <ImageBackground
                    source={images.bkImage}
                    style={BACKGROUND_IMAGE}
                    resizeMethod={'scale'}
                    resizeMode='cover'
                >


                    <View
                        style={{
                            height: '10%',
                            marginTop: Layout.window.height / 15,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <Image
                                style={APP_LOGO}
                                source={images.appLogo}
                                resizeMethod={'auto'}
                                resizeMode='cover'
                            />
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            height: '10%',
                        }}
                    >
                        <Text

                            style={SIGN_IN_TEXT}
                        >
                            {translate(`emailSignIn.join`)}
                        </Text>
                    </View>

                    <Formik
                        initialValues={{
                            email: "",
                            password: ""
                        }}
                        validationSchema={schema}
                        onSubmit={submit}
                        enableReinitialize
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            errors,
                            isValid,
                            handleSubmit
                        }: FormikProps<MyFormValues>) => (
                            <View>

                                <View
                                    style={FIELD}
                                >
                                    <TextField
                                        name="email"
                                        keyboardType="email-address"
                                        placeholderTx="common.emailPlaceHolder"
                                        value={values.email}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        isInvalid={!isValid}
                                        fieldError={errors.email}
                                        onSubmitEditing={() => passwordInput.focus()}
                                        forwardedRef={i => {
                                            emailInput = i
                                        }}
                                    />

                                    <TextField
                                        name="password"
                                        secureTextEntry
                                        placeholderTx="common.passwordPlaceHolder"
                                        value={values.password}
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        isInvalid={!isValid}
                                        fieldError={errors.password}
                                        forwardedRef={i => {
                                            passwordInput = i
                                        }}
                                        onSubmitEditing={() => handleSubmit()}
                                    />

                                    <Button
                                        style={FORGOT_PASSWORD_LINK_BUTTON}
                                        textStyle={FORGOT_PASSWORD__LINK_TEXT}
                                        preset="link"
                                        tx="emailSignIn.forgotPassword"
                                        onPress={() => navigation.navigate('forgotPassword')}
                                    />

                                    <Button
                                        style={CONTINUE_BUTTON}
                                        textStyle={CONTINUE_BUTTON_TEXT}
                                        disabled={!isValid || isLoading}
                                        onPress={() => handleSubmit()}
                                    >
                                        {
                                            isLoading
                                                ? <ActivityIndicator size="small" color={colors.white} />
                                                : <Text style={CONTINUE_BUTTON_TEXT}>{translate(`emailSignIn.signIn`)}</Text>
                                        }
                                    </Button>
                                </View>
                            </View>
                        )}
                    </Formik>

                    <Text

                        style={BOTTOM_TEXT}
                    >
                        {translate("emailSignIn.yes")}
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >

                        <Text

                            style={termsAndConditions}
                        >
                            {translate(`emailSignIn.createAccount`)}

                        </Text>
                    </TouchableOpacity>


                </ImageBackground>


            </ScrollView>
        </KeyboardAvoidingView >
    )
}

export default EmailSignIn
