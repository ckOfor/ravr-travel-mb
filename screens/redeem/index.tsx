// react
import React, { useEffect, useRef, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, Alert, RefreshControl,
    ScrollView, TouchableOpacity, FlatList, Clipboard, ActivityIndicator
} from "react-native";

// third-party
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useFocusEffect } from '@react-navigation/native';
import TransactionCard from "../../components/TransactionCard";
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import SlidingUpPanel from "rn-sliding-up-panel";

// redux

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";
import { Header } from "../../components/header";

// styles
import { Layout } from "../../constants";
import { colors, fonts } from "../../theme";

// util
import { translate } from "../../i18n";
import useReduxStore from "../../utils/hooks/useRedux";
import { fetchMyCoupons, cancelMyCoupons, createCoupon } from "../../redux/auth";
import { formatAmount } from "../../utils/formatters";

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
    // marginTop: Layout.window.height / 15,
    // width: '50%'
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
    // width: Layout.window.width / 1.9,
}

const DISCOVER_MORE: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20,
    // width: Layout.window.width / 1.2,
    marginTop: 10
}

const discoverMoreTextStyle: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20
    // alignSelf: 'flex-start',
    // width: Layout.window.width / 1.5,
    // marginLeft: 20,
}

const discoverTextStyle: TextStyle = {
    fontSize: 22,
    color: colors.black,
    fontFamily: fonts.RubikRegular,
    lineHeight: 40,
    textAlign: 'left',
    width: Layout.window.width / 1.5,
}

const REDEEM_BUTTON: ViewStyle = {
    borderRadius: 100,
    width: Layout.window.width / 1.4,
    marginTop: 10,
    backgroundColor: colors.ravrPurple,
}

const REDEEM_BUTTON_TEXT: TextStyle = {
    fontSize: 12,
    fontFamily: fonts.RubikRegular,
    color: colors.white,
    textTransform: 'uppercase'
}

const VERSION: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20,
    // alignSelf: 'flex-start',
    // width: Layout.window.width / 1.5,
    marginTop: 20,
}

interface MyFormValues {
    amount: string
}

interface StateProps {
    amount: string
}

const schema = Yup.object().shape({
    amount: Yup.number().min(100, "common.amountSmall")
        .required("common.fieldRequired")
})

const Redeem = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("loading");
    const coupons = selectStore("coupons");

    // PROPS
    let slidingUpPanelRef = useRef<SlidingUpPanel>(null);
    let amountInput = useRef(null)

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

    useEffect(() => {
        dispatch(fetchMyCoupons())
    }, [])

    const submit = ({ amount }) => {
        console.log(amount)
        dispatch(createCoupon(amount))
    }

    const returnIcon = (status: string, reference: string) => {
        if (status === "available") return (
            <View
                style={{
                    flexDirection: 'row'
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            `${translate('redeem.warning')}`,
                            `${translate('redeem.warningBody')}`,
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "OK", onPress: () => dispatch(cancelMyCoupons(reference)) }
                            ]
                        );
                    }}
                >
                    <MaterialIcons
                        name="cancel"
                        size={24}
                        color="#F24040"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        Clipboard.setString(reference);
                        Alert.alert(
                            `${translate('redeem.copy')}`,
                            `${translate('redeem.copyBody')}`,
                            [
                                {
                                    text: 'OK', onPress: () => {
                                        console.log('OK Pressed')
                                    }
                                },
                            ],
                            { cancelable: false },
                        );
                    }}
                >
                    <Feather
                        name="copy"
                        size={24}
                        color="black"
                        style={{
                            marginLeft: 20
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const renderPrice = ({ item }: any, index: any) => {

        const { amount, reference, status } = item
        console.log(item)

        return (
            <View
                style={{
                    marginHorizontal: 20
                }}
            >

                <TransactionCard
                    status={`${status}`}
                    title={`₦${formatAmount(amount.toString())}`}
                    subTitle={`${translate('redeem.code')}: ${reference}`}
                    rightIcon={returnIcon(status, reference)}
                />

            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            style={{
                backgroundColor: 'white',
                height: '100%'
            }}
        >

            <View
                style={{
                    marginHorizontal: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: Platform.OS === "ios" ? Layout.window.height / 20 : Layout.window.height / 30,
                }}
            >
                <View

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
                                {translate(`redeem.header`)}
                            </Text>

                        </View>

                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        backgroundColor: colors.transparent
                    }}
                >
                    <MaterialCommunityIcons
                        name="keyboard-backspace"
                        color={colors.ravrPurple}
                        size={26}
                    />

                </TouchableOpacity>


            </View>

            <ScrollView>

                <View
                    style={{
                        marginHorizontal: 20
                    }}
                >

                    <Text

                        style={DISCOVER_MORE}
                    >
                        {translate(`redeem.selectOption`)}
                    </Text>
                </View>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={coupons}
                    renderItem={renderPrice}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            progressBackgroundColor={'transparent'}
                            style={{
                                margin: 0,
                                padding: 0,
                            }}
                            onRefresh={() => {
                                dispatch(fetchMyCoupons())
                            }}
                        />
                    }
                    style={{
                        marginBottom: Layout.window.height / 5
                    }}
                    ListEmptyComponent={
                        <View
                            style={{
                                marginTop: Layout.window.height / 4,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    marginRight: 10
                                }}
                            >
                                {!loading && `${translate('common.listIsEmpty')}`}
                            </Text>
                        </View>
                    }
                    contentContainerStyle={{
                        marginTop: 20,
                        justifyContent: "space-between",
                        paddingBottom: Layout.window.height / 4
                    }}

                />


            </ScrollView>

            <SlidingUpPanel
                ref={slidingUpPanelRef}
                draggableRange={{
                    top: Layout.window.height / 1.5,
                    bottom: 0,
                }}
                friction={0.5}
                allowDragging={false}
            >
                <View
                    style={{
                        height: Layout.window.height,
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        padding: 20,
                    }}
                >

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            marginTop: 10,
                        }}
                    >
                        <View>
                            <Text

                                style={discoverTextStyle}
                            >
                                {translate(`redeem.createCouponHeader`)}
                            </Text>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`redeem.createCouponBody`)}
                            </Text>
                        </View>
                    </View>

                    <Formik
                        initialValues={{
                            amount: ""
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
                                    style={{
                                        alignItems: 'center',
                                        marginTop: 20
                                    }}
                                >

                                    <TextField
                                        name="amount"
                                        keyboardType="number-pad"
                                        placeholderTx="redeem.enterAmount"
                                        value={values.amount}
                                        onChangeText={handleChange("amount")}
                                        onBlur={handleBlur("amount")}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        isInvalid={!isValid}
                                        fieldError={errors.amount}
                                        forwardedRef={i => {
                                            amountInput = i
                                        }}
                                        // onSubmitEditing={() => handleSubmit()}
                                        maxLength={6}
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
                                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`redeem.create`)}</Text>
                                        }
                                    </Button>
                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </SlidingUpPanel>
        </KeyboardAvoidingView >
    )
}

export default Redeem
