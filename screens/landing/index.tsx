// react
import React, { useEffect, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ScrollView, RefreshControl,
    Pressable
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

interface MyFormValues {
    searchKey: string
}

interface StateProps {
    authSearchKey: string
}

const schema = Yup.object().shape({
    searchKey: Yup.string(),
})

const LandingPage = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");


    // PROPS

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

    const submit = (value: string) => {
        console.log(value)
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
                                {translate(`landing.findTour`)}
                            </Text>
                        </View>

                    </View>

                    <Text

                        style={DISCOVER_MORE}
                    >
                        {translate(`landing.findTourMore`)}
                    </Text>

                    <Formik
                        initialValues={{
                            searchKey: authSearchKey
                        }}
                        validationSchema={schema}
                        onSubmit={({ searchKey }) => submit(searchKey)}
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
                                        marginTop: 15
                                    }}
                                >
                                    <TextField
                                        name="searchKey"
                                        keyboardType="default"
                                        placeholderTx="landing.search"
                                        value={values.searchKey}
                                        onChangeText={handleChange("searchKey")}
                                        onBlur={handleBlur("searchKey")}
                                        autoCapitalize="none"
                                        returnKeyType="search"
                                        isInvalid={!isValid}
                                        fieldError={errors.searchKey}
                                        forwardedRef={i => {
                                            // this.searchKeyInput = i
                                        }}
                                        placeholderTextColor={colors.faddedGrey}
                                        onSubmitEditing={() => handleSubmit()}
                                    />
                                </View>
                            </View>
                        )}
                    </Formik>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: "space-between",
                        }}
                    >
                        <View
                            style={POPULAR_PLACES}
                        >
                            <Text

                                style={POPULAR_PLACES_TEXT}
                            >
                                {translate(`landing.popularCities`)}
                            </Text>
                        </View>

                        <Pressable
                            style={POPULAR_PLACES}
                        >
                            <Text

                                style={MORE}
                            >
                                {translate(`landing.more`)}
                            </Text>
                        </Pressable>
                    </View>


                </ScrollView>
            </View>
        </KeyboardAvoidingView >
    )
}

export default LandingPage
