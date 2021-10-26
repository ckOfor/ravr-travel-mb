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
import { FontAwesome, AntDesign, MaterialIcons } from 'react-native-vector-icons';


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
import { editProfile, notify, signInSignUp, toggleLoggedIn } from "../../redux/auth";

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
    // marginLeft: 20,
    height: 50,
    width: 50,
}

const SIGN_IN_TEXT: TextStyle = {
    fontSize: 22,
    marginLeft: 20,
    color: colors.ravrPurple,
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
    phoneNumber: string
}


const CONTINUE_BUTTON: ViewStyle = {
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: Layout.window.width / 1.4,
    backgroundColor: colors.ravrPurple,
    marginTop: 30
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
    phoneNumber: Yup.string()
        .min(11, "common.fieldTooShort")
        .required("common.fieldRequired"),
})

const EditProfile = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const isLoggedIn = selectStore('isLoggedIn')
    const isLoading = selectStore('loading')
    const user = selectStore('user')
    const { fullName, email, phoneNumber } = user
    console.log(user)

    // PROPS
    let fullNameInput = useRef(null)
    let emailInput = useRef(null)
    let phoneNumberInput = useRef(null)

    // LIFECYCLE
    useEffect(() => {
        if (Platform.OS === "android" || !isLoggedIn) {
            StatusBar.setBackgroundColor(colors.ravrPurple)
            StatusBar.setBarStyle("light-content")
        } else {
            StatusBar.setBarStyle("dark-content")
        }
    }, [])

    const submit = values => {
        const { fullName, phoneNumber } = values;
        console.log(fullName, phoneNumber)
        dispatch(editProfile(fullName, phoneNumber))
    }


    return (
        <KeyboardAvoidingView
            enabled={true}
            style={{
                flex: 1,
                backgroundColor: colors.white
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    height: '100%',
                }}
                bounces={false}
            >
                <View
                    source={images.bikeMan}
                    style={BACKGROUND_IMAGE}
                    resizeMethod={'scale'}
                    resizeMode='cover'
                >


                    <View
                        style={{
                            height: '10%',
                            marginTop: Layout.window.height / 15,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 20
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                top: 10
                            }}
                        >
                            {/* <Image
                                style={APP_LOGO}
                                source={images.appLogo}
                                resizeMethod={'auto'}
                                resizeMode='cover'
                            /> */}
                            <MaterialIcons
                                name="keyboard-backspace"
                                color={colors.ravrPurple}
                                size={26}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {

                                Alert.alert(
                                    `${translate('redeem.warning')}`,
                                    `${translate('editProfie.warningBody')}`,
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        {
                                            text: "OK", onPress: () => {
                                                dispatch(toggleLoggedIn())
                                                navigation.navigate('Auth')
                                            }
                                        }
                                    ]
                                );
                            }}
                            style={{
                                top: 10
                            }}
                        >
                            <AntDesign
                                name="logout"
                                color={colors.ravrPurple}
                                size={26}
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
                            {translate(`editProfie.header`)}
                        </Text>
                    </View>

                    <Formik
                        initialValues={{
                            fullName: fullName || "",
                            email: email || "",
                            phoneNumber: phoneNumber || "",
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
                                        onSubmitEditing={() => phoneNumberInput.current.focus()}
                                        forwardedRef={i => {
                                            emailInput = i
                                        }}
                                        editable={false}
                                    />

                                    <TextField
                                        name="phoneNumber"
                                        placeholderTx="common.phoneNumberPlaceHolder"
                                        value={values.phoneNumber}
                                        onChangeText={handleChange("phoneNumber")}
                                        onBlur={handleBlur("phoneNumber")}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        isInvalid={!isValid}
                                        fieldError={errors.phoneNumber}
                                        forwardedRef={i => {
                                            phoneNumberInput = i
                                        }}
                                        maxLength={11}
                                        blurOnSubmit={false}
                                        keyboardType="number-pad"
                                        onSubmitEditing={() => Keyboard.dismiss()}
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
                                                : <Text style={CONTINUE_BUTTON_TEXT}>{translate(`editProfie.submit`)}</Text>
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


                </View>


            </ScrollView>
        </KeyboardAvoidingView >
    )
}

export default EditProfile
