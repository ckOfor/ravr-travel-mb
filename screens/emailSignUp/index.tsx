// react
import React, { useEffect, useRef, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ImageBackground, ImageStyle, Image, ActivityIndicator, Alert, ScrollView, TouchableOpacity,
    Keyboard
} from "react-native";

// third-party
import { Settings } from 'react-native-fbsdk-next';
import { LoginManager } from "react-native-fbsdk-next";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import firebase from 'react-native-firebase';
import Crypto from "crypto-js";

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
    height: Layout.window.height,
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
    marginTop: Layout.window.height / 20,
    color: colors.white,
    fontFamily: fonts.RubikMedium,
    textAlign: 'left',
    width: Layout.window.width / 1.1
}

const FIELD: ViewStyle = {
    alignItems: 'center'
}

interface MyFormValues {
    fullName: string
    email: string
    password: string
    confirmPassword: string
}


const CONTINUE_BUTTON: ViewStyle = {
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: Layout.window.width / 1.4,
    // marginTop: 25,
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
    marginTop: 35,
    color: colors.white,
    fontFamily: fonts.RubikRegular,
    textAlign: 'left',
    width: Layout.window.width / 1.5
}

const schema = Yup.object().shape({
    fullName: Yup.string()
        .min(4, "common.fieldTooShort")
        .required("common.fieldRequired"),
    email: Yup.string()
        .email("common.fieldValidEmail")
        .required("common.fieldRequired"),
    password: Yup.string()
        .min(4, "common.fieldTooShort")
        .required("common.fieldRequired"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'common.passwordMatch')
        .required("common.fieldRequired"),
})

const EmailSignUp = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const isLoggedIn = selectStore('isLoggedIn')
    const isLoading = selectStore('loading')

    // PROPS
    let fullNameInput = useRef(null)
    let emailInput = useRef(null)
    let passwordInput = useRef(null)
    let confirmPasswordInput = useRef(null)

    // LIFECYCLE
    useEffect(() => {
        if (Platform.OS === "android" || !isLoggedIn) {
            StatusBar.setBackgroundColor(colors.ravrPurple)
            StatusBar.setBarStyle("light-content")
        }
    }, [])

    const submit = values => {
        const { email, password, fullName } = values;
        console.log("fullName", fullName.split(' '))
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                // If you need to do anything with the user, do it here
                // The user will be logged in automatically by the
                // `onAuthStateChanged` listener we set up in App.js earlier
                console.log(user)
                const payload = {
                    fullName,
                    email,
                    password,
                    pictureURL: '',
                    authType: 'email'
                }
                firebase.auth().onAuthStateChanged(function (user) {
                    user.sendEmailVerification();
                });
                dispatch(signInSignUp(payload))
            })
            .catch((error) => {
                const { code, message } = error;
                console.log(error, "error")
                Alert.alert(
                    'Error', message,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
                // For details of error codes, see the docs
                // The message contains the default Firebase string
                // representation of the error
            });


    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            // style={{ flex: 1 }}
        >
            <ScrollView
                style={{
                    height: Layout.window.height,
                    // marginBottom: 1000
                }}
                // bounces={false}
            >
                <ImageBackground
                    source={images.bikeMan}
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
                            {translate(`emailSignUp.join`)}
                        </Text>
                    </View>

                    <Formik
                        initialValues={{
                            fullName: "",
                            email: "",
                            password: "",
                            confirmPassword: "",
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
                                        name="fullName"
                                        keyboardType="default"
                                        placeholderTx="common.fullNamePlaceHolder"
                                        value={values.fullName}
                                        onChangeText={handleChange("fullName")}
                                        onBlur={handleBlur("fullName")}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                        isInvalid={!isValid}
                                        fieldError={errors.fullName}
                                        onSubmitEditing={() => emailInput.current.focus()}
                                        forwardedRef={i => {
                                            fullNameInput = i
                                        }}
                                    />

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
                                        onSubmitEditing={() => passwordInput.current.focus()}
                                        forwardedRef={emailInput}
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
                                        forwardedRef={passwordInput}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => confirmPasswordInput.current.focus()}
                                    />

                                    <TextField
                                        name="confirmPassword"
                                        secureTextEntry
                                        placeholderTx="common.confirmPasswordPlaceHolder"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange("confirmPassword")}
                                        onBlur={handleBlur("confirmPassword")}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        isInvalid={!isValid}
                                        fieldError={errors.confirmPassword}
                                        forwardedRef={confirmPasswordInput}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => {
                                            handleSubmit()
                                            Keyboard.dismiss()
                                        }}
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
                                                : <Text style={CONTINUE_BUTTON_TEXT}>{translate(`emailSignUp.signUp`)}</Text>
                                        }
                                    </Button>
                                </View>
                            </View>
                        )}
                    </Formik>

                    <Text

                        style={BOTTOM_TEXT}
                    >
                        {translate("emailSignUp.member")}
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('EmailSignIn')}
                    >

                        <Text

                            style={termsAndConditions}
                        >
                            {translate(`emailSignUp.oops`)}

                        </Text>
                    </TouchableOpacity>


                </ImageBackground>


            </ScrollView>
        </KeyboardAvoidingView >
    )
}

export default EmailSignUp
