// react
import React, { useEffect, useRef, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ScrollView, RefreshControl,
    ActivityIndicator
} from "react-native";

// third-party
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useFocusEffect } from '@react-navigation/native';

// redux

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts } from "../../theme";

// util
import { translate } from "../../i18n";
import useReduxStore from "../../utils/hooks/useRedux";
import { createWallet } from "../../redux/auth";

const ROOT: ViewStyle = {
    height: Layout.window.height,
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.window.width,
    backgroundColor: colors.white
};

const SCROLL_ROOT: ViewStyle = {
    marginBottom: Platform.OS === "ios" ? 0 : Layout.window.height / 15
};

const HEADER_VIEW: ViewStyle = {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: Layout.window.height / 15,
    width: Layout.window.height / 2.5,
};

const TITLE_VIEW: ViewStyle = {
    flexDirection: "row",
    justifyContent: 'space-between',
};

const DISCOVER: TextStyle = {
    fontSize: 22,
    color: colors.blackTwo,
    fontFamily: fonts.RubikRegular,
    lineHeight: 40,
    textAlign: 'left',
    width: Layout.window.width / 1.9,
}

const DISCOVER_MORE: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20,
    width: Layout.window.width / 1.2,
    marginTop: 10
}

const POPULAR_PLACES: TextStyle = {
    flexDirection: "row",
    justifyContent: 'space-between',
}

const POPULAR_PLACES_TEXT: TextStyle = {
    fontSize: 22,
    color: colors.blackTwo,
    fontFamily: fonts.RubikMedium,
    lineHeight: 40,
    textAlign: 'left',
}

const MORE: TextStyle = {
    fontSize: 14,
    color: colors.faddedGrey,
    fontFamily: fonts.RubikRegular,
    lineHeight: 40,
    textAlign: 'left',
}


const REDEEM_BUTTON: ViewStyle = {
    borderRadius: 100,
    width: Layout.window.width / 1.4,
    marginTop: Layout.window.height / 20,
    backgroundColor: colors.ravrPurple,
}

const REDEEM_BUTTON_TEXT: TextStyle = {
    fontSize: 12,
    fontFamily: fonts.RubikRegular,
    color: colors.white,
    textTransform: 'uppercase'
}

const BACKGROUND_IMAGE: ImageStyle = {
    height: Layout.window.height > 700 ? Layout.window.height / 2.5 : Layout.window.height / 2,
    // width: Layout.window.width,
    // flex: 1,
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
}

interface MyFormValues {
    bvn: string
    phoneNumber: string
}

interface StateProps {
    authbvn: string
}

const schema = Yup.object().shape({
    bvn: Yup.string()
        .min(11, "common.fieldTooShort")
        .required("common.fieldRequired"),
    phoneNumber: Yup.string()
        .min(11, "common.fieldTooShort")
        .required("common.fieldRequired"),
})

const CreateWallet = ({ navigation, route, authbvn }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("loading")


    // PROPS
    let bvnInput = useRef(null)
    let phoneNumberInput = useRef(null)

    // LIFECYCLE
    useFocusEffect(
        React.useCallback(() => {
            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor(colors.ravrPurple)
                StatusBar.setBarStyle("light-content")
            } else {
                StatusBar.setBarStyle("dark-content")
            }

        }, [])
    );

    const submit = (value: MyFormValues) => {
        console.log(value)
        const { phoneNumber, bvn } = value
        dispatch(createWallet(phoneNumber, bvn))
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
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {

                            }}
                        />
                    }
                    style={SCROLL_ROOT}
                >
                    <View
                        style={HEADER_VIEW}
                    >
                        <View
                            style={TITLE_VIEW}
                        >
                            <Text

                                style={DISCOVER}
                            >
                                {translate(`wallet.header`)}
                            </Text>
                        </View>

                    </View>

                    <Text

                        style={DISCOVER_MORE}
                    >
                        {translate(`wallet.body`)}
                    </Text>

                    <Formik
                        initialValues={{
                            bvn: "",
                            phoneNumber: ""
                        }}
                        validationSchema={schema}
                        onSubmit={({ bvn }) => submit(bvn)}
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
                                    style={{
                                        alignItems: 'center',
                                        marginTop: Layout.window.height / 15
                                    }}
                                >
                                    <TextField
                                        name="bvn"
                                        keyboardType="number-pad"
                                        placeholderTx="wallet.enterBVN"
                                        value={values.bvn}
                                        onChangeText={handleChange("bvn")}
                                        onBlur={handleBlur("bvn")}
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        isInvalid={!isValid}
                                        fieldError={errors.bvn}
                                        forwardedRef={i => {
                                            bvnInput = i
                                        }}
                                        maxLength={11}
                                        placeholderTextColor={colors.faddedGrey}
                                        onSubmitEditing={() => phoneNumberInput.current.focous()}
                                    />

                                    <TextField
                                        name="phoneNumber"
                                        keyboardType="number-pad"
                                        placeholderTx="wallet.enterphoneNumber"
                                        value={values.phoneNumber}
                                        onChangeText={handleChange("phoneNumber")}
                                        onBlur={handleBlur("phoneNumber")}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        isInvalid={!isValid}
                                        fieldError={errors.bvn}
                                        forwardedRef={i => {
                                            bvnInput = i
                                        }}
                                        maxLength={11}
                                        placeholderTextColor={colors.faddedGrey}
                                    // onSubmitEditing={() => handleSubmit()}
                                    />

                                    <Button
                                        style={REDEEM_BUTTON}
                                        textStyle={REDEEM_BUTTON_TEXT}
                                        disabled={!isValid || loading}
                                        onPress={() => handleSubmit()}
                                    >
                                        {
                                            loading
                                                ? <ActivityIndicator size="small" color={colors.white} />
                                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`wallet.createWallet`)}</Text>
                                        }
                                    </Button>
                                </View>
                            </View>
                        )}
                    </Formik>

                </ScrollView>
            </View>
        </KeyboardAvoidingView >
    )
}

export default CreateWallet
