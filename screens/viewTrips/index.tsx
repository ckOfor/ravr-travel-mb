// react
import React, { useEffect, useRef, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ScrollView,
    FlatList, TouchableOpacity, ImageBackground, Share, ActivityIndicator, Linking, Image
} from "react-native";

// third-party
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Entypo, Feather, AntDesign } from 'react-native-vector-icons';
import SlidingUpPanel from "rn-sliding-up-panel";
import moment from "moment";
import { FlutterwaveInit } from 'flutterwave-react-native';
import { FLUTTER_PUBLIC_KEY } from "@env"
import { WebView } from 'react-native-webview';

// redux
import { notify, payForTripWithFlutterwave, payForTripWithPaystack, payForTripWithWallet, toggleWebView } from "../../redux/auth";
import useReduxStore from "../../utils/hooks/useRedux";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";
import { Header } from "../../components/header";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";

// util
import { translate } from "../../i18n";
import { formatAmount } from "../../utils/formatters";

const ROOT: ViewStyle = {
    height: Layout.window.height,
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.window.width,
    backgroundColor: colors.white
};

const SCROLL_ROOT: ViewStyle = {
    marginBottom: Platform.OS === "ios" ? 0 : Layout.window.height / 15,
    width: Layout.window.width
};

const HEADER_VIEW: ViewStyle = {
    flexDirection: 'row',
    justifyContent: "space-between",
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
    lineHeight: 22,
    textAlign: 'left',
    width: Layout.window.width / 1.9,
}

const DISCOVER_MORE: TextStyle = {
    color: colors.blackTwo,
    fontFamily: fonts.RubikMedium,
    // width: Layout.window.width / 1.2,
    marginTop: 10,
    fontSize: 15
}

const DATE: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikMedium,
    margin: 15,
}

const discoverMoreTextStyle: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20
}

const selectPaymentMethod: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    right: 10

}

const paymentCompany: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikMedium,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 5
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


interface MyFormValues {
    numberOfPeople: string
}


const schema = Yup.object().shape({
    numberOfPeople: Yup.number().min(1, 'common.numberOfPeople').required('common.fieldRequired'),
})

const ViewTrips = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("loading");
    const user = selectStore("user");
    const webViewURL = selectStore("webViewURL");
    const selectedAmount = selectStore("selectedAmount");
    const showWebView = selectStore("showWebView");
    console.log(webViewURL, "webViewURL")
    console.log(showWebView, "showWebView")

    const {
        location, name, imageOne, imageTwo, imageThree, poster, startDate, endDate, packages, description, id,
        ravrPercentage, phoneNumber, paymentList
    } = route.params.trip


    // PROPS
    const [tripStartDate, setTripStartDate] = useState('')
    const [tripEndDate, setTripEndDate] = useState('')
    const [dateDiff, setDateDiff] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [selectedPackage, setSelectedPackage] = useState([])
    const [paymentLink, setPaymentLink] = useState('')
    const [isLoading, setLoading] = useState(false)
    let slidingUpPanelRef = useRef<SlidingUpPanel>(null);
    let numberOfPeopleInput = useRef(null)
    let formikRef = useRef(null)
    const [totalAmount, setTotalAmount] = useState(0)

    // LIFECYCLE
    useFocusEffect(
        React.useCallback(() => {
            calculateDate()
            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor(colors.ravrPurple)
                StatusBar.setBarStyle("light-content")
            } else {
                StatusBar.setBarStyle("dark-content")
            }

        }, [])
    );

    const returnPrice = (amount: string) => {
        return (parseInt(amount) * ravrPercentage) + parseInt(amount)
    }

    const calculateDate = () => {

        const firstTwoStart = parseInt(startDate.substring(0, 2))
        const firstTwoEnd = parseInt(startDate.substring(0, 2))

        const middleTwoStart = parseInt(startDate.substring(3, 6))
        const middleTwoEnd = parseInt(startDate.substring(3, 6))

        const lastFourStart = parseInt(startDate.substr(startDate.length - 4))
        const lastFourEnd = parseInt(endDate.substr(endDate.length - 4))

        let beginningDate = new Date(lastFourStart, middleTwoStart, firstTwoStart);
        let endingDate = new Date(lastFourEnd, middleTwoEnd, firstTwoEnd);

        let tripStartDate = moment(beginningDate).subtract(1, 'months')
        let tripEndDate = moment(endingDate).subtract(1, 'months')

        let dateDiff = tripStartDate.diff(tripEndDate, 'days')
        let daysDiff = dateDiff > 0 ? `${dateDiff} day(s)` : '1 day'

        setTripStartDate(`${moment(tripStartDate).format('Do dddd MMM')}`)
        setTripEndDate(`${moment(tripEndDate).format('Do dddd MMM')}`)
        setDateDiff(daysDiff)
    }

    const submit = async (values: any) => {
        const { numberOfPeople } = values
        const payload = {
            tripId: id,
            numberOfPeople,
            selectedPackage
        }

        if (numberOfPeople % 1 != 0) {
            dispatch(notify(`${translate('trips.invalidNumber')}`, 'Error'))
        } else {
            // dispatch(payForTrip(payload))
            const generatedId = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            const tx_ref = `ravr_${generatedId}`;

            if (paymentMethod === "wallet") return dispatch(payForTripWithWallet(payload))

            if (paymentMethod === "flutterwave") {
                const amount = totalAmount * returnPrice(selectedPackage.price)
                const flutterwaveCharge = 0.014 * amount
                const amountToCharge = (flutterwaveCharge > 2000 ? 2000 : flutterwaveCharge) + amount

                try {
                    // initialize payment
                    const paymentLink = await FlutterwaveInit({
                        tx_ref,
                        authorization: FLUTTER_PUBLIC_KEY,
                        amount: amountToCharge,
                        currency: 'NGN',
                        customer: {
                            email: user.email
                        },
                        payment_options: 'card',
                        redirect_url: 'https://ravr-travel.herokuapp.com/api/v1/trips/pay/success'
                    });
                    // use payment link
                    // console.log(paymentLink);
                    setPaymentLink(paymentLink)
                    // setShowWebView(true)
                    dispatch(payForTripWithFlutterwave({
                        ...payload,
                        reference: tx_ref,
                        paymentLink
                    }))
                    console.log("called")

                } catch (error) {
                    console.log("error", error)

                    // handle payment error
                    dispatch(notify(error.message, 'Error'))
                }
            }

            if (paymentMethod === "paystack") {
                const amount = totalAmount * returnPrice(selectedPackage.price)

                const paystackCharge = (0.015 * amount)
                const amountToCharge = (amount < 2500 ? paystackCharge : paystackCharge + 100) + amount

                dispatch(payForTripWithPaystack({
                    ...payload,
                    reference: tx_ref,
                    paymentLink,
                    amount: amountToCharge * 100
                }))
            }
        }
    }

    const onShare = async () => {

        try {
            const result = await Share.share({
                message: `${name} at ${location}: ${startDate} - ${endDate}`,
                url: poster,
                title: name
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const returnPopular = ({ item }) => {

        return (
            <TouchableOpacity>

                <ImageBackground
                    style={{
                        height: Layout.window.height / 5,
                        width: Layout.window.width / 1.5,
                        marginRight: 20,
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                        justifyContent: "space-between",
                    }}
                    source={{ uri: item }}
                    imageStyle={{
                        borderRadius: 8,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        borderColor: colors.transparent,
                        elevation: 3,
                    }}
                    resizeMode="cover"
                    resizeMethod="auto"
                >


                </ImageBackground>

            </TouchableOpacity>
        )
    }

    const returnPrices = ({ item }) => {
        const { name, description, price } = item

        return (
            <TouchableOpacity
                style={{
                    backgroundColor: 'rgba(64, 64, 64, 0.04);',
                    padding: 15,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                    width: '95%'
                }}
                onPress={() => {
                    setSelectedPackage(item)
                    slidingUpPanelRef.current.show()
                }}
                disabled={user.id === 0}
            >

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <View
                        style={{
                            // borderWidth: 1,
                            borderRadius: 15,
                            height: 30,
                            width: 30,
                            backgroundColor: colors.white,
                            borderColor: colors.ravrPurple,
                            alignSelf: 'center'
                        }}
                    >



                    </View>

                    <View
                        style={{
                            marginLeft: 15
                        }}
                    >
                        <Text
                            style={{
                                // fontSize: 22,
                                color: colors.blackTwo,
                                fontFamily: fonts.RubikMedium,
                                // lineHeight: 22,
                                textAlign: 'left',
                                width: Layout.window.width / 1.9,
                            }}
                        >
                            {name}
                        </Text>

                        <Text
                            style={{
                                // fontSize: 22,
                                color: colors.blackTwo,
                                fontFamily: fonts.RubikRegular,
                                // lineHeight: 22,
                                textAlign: 'left',
                                width: Layout.window.width / 2.5,
                            }}
                            numberOfLines={100}
                        >
                            {description}
                        </Text>
                    </View>
                </View>

                <View>

                    <View>
                        <Text
                            style={{
                                color: colors.blackTwo,
                                fontFamily: fonts.RubikMedium,
                                textAlign: 'left',
                                width: Layout.window.width / 1.9,
                                right: 10,
                                top: 10
                            }}
                        >
                            ₦ {formatAmount(returnPrice(price))}
                        </Text>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    const returnUsers = ({ item }) => {
        const { picture, packagePrice, name, packageName, numberOfPeople } = item

        return (
            <View
                style={{
                    backgroundColor: 'rgba(64, 64, 64, 0.04);',
                    padding: 15,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                    width: '95%'
                }}
                disabled={user.id === 0}
            >

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Image
                        source={{ uri: picture }}
                        style={{
                            height: 50,
                            width: 50,
                            borderRadius: 25
                        }}
                    />

                    <View
                        style={{
                            marginLeft: 15
                        }}
                    >
                        <Text
                            style={{
                                // fontSize: 22,
                                color: colors.blackTwo,
                                fontFamily: fonts.RubikMedium,
                                // lineHeight: 22,
                                textAlign: 'left',
                                width: Layout.window.width / 1.9,
                            }}
                        >
                            {name}
                        </Text>

                        <Text
                            style={{
                                // fontSize: 22,
                                color: colors.blackTwo,
                                fontFamily: fonts.RubikMedium,
                                textAlign: 'left',
                                width: Layout.window.width / 1.9,
                                top: 10
                            }}
                            numberOfLines={100}
                        >
                            {packageName} - ₦ {formatAmount(returnPrice(packagePrice * numberOfPeople))}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: 'row'
                    }}
                >

                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(`tel:${phoneNumber}`)
                        }}
                    >
                        <Feather
                            name="phone-call"
                            color={colors.ravrPurple}
                            size={20}
                            style={{
                                top: 6,
                                right: 10
                            }}
                        />
                    </TouchableOpacity>

                    {/* <TouchableOpacity>
                        <AntDesign
                            name="eye"
                            color={colors.ravrPurple}
                            size={26}
                            style={{
                                top: 4,
                            }}
                        />
                    </TouchableOpacity> */}



                </View>

            </View>
        )
    }

    if (showWebView) {
        return (
            <View
                style={{
                    height: Layout.window.height > 700 ? Layout.window.height / 1.1 : Layout.window.height / 1.07
                }}
            >

                <Header
                    navigation={navigation}
                    onRightPress={() => {
                        dispatch(toggleWebView(false))
                    }}
                    rightView={
                        <TouchableOpacity
                            onPress={() => {
                                dispatch(toggleWebView(false))
                            }}
                        >
                            <MaterialCommunityIcons
                                name="cancel"
                                color={colors.ravrPurple}
                                size={26}
                            />

                        </TouchableOpacity>
                    }
                />

                {
                    loading && (
                        <ActivityIndicator
                            color={colors.ravrPurple}
                            size="large"
                            style={{
                                marginTop: Layout.window.height / 3
                            }}
                        />
                    )
                }

                <WebView
                    source={{ uri: webViewURL }}
                    onLoadEnd={() => {
                        // setLoading(false)
                    }}
                />
            </View>

        )
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
        >
            <View
                style={ROOT}
            >
                <View
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    style={SCROLL_ROOT}
                >
                    <View
                        style={{
                            marginHorizontal: 15,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: Platform.OS === "ios" ? Layout.window.height / 15 : Layout.window.height / 10,
                        }}
                    >
                        <View>
                            <View
                                style={HEADER_VIEW}
                            >
                                <View
                                    style={TITLE_VIEW}
                                >
                                    <Text

                                        style={DISCOVER}
                                    >
                                        {translate(`viewTrips.header`)}
                                    </Text>
                                </View>
                            </View>

                            <Text

                                style={DISCOVER_MORE}
                            >
                                {location}
                            </Text>
                        </View>


                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <MaterialCommunityIcons
                                name="keyboard-backspace"
                                color={colors.ravrPurple}
                                size={26}
                            />

                        </TouchableOpacity>



                    </View>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={[imageOne, imageTwo, imageThree, poster]}
                        renderItem={returnPopular}
                        style={{
                            marginVertical: Layout.window.height / 35,
                            paddingLeft: 15,
                        }}
                        horizontal
                        contentContainerStyle={{
                            marginTop: 20,
                            justifyContent: "space-between"
                        }}

                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >

                        <View>
                            <Text

                                style={[DISCOVER_MORE, { marginHorizontal: 15 }]}
                            >
                                {name}
                            </Text>

                            <Text

                                style={DATE}
                            >
                                {tripStartDate} - {tripEndDate}  {`(${dateDiff})`}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                right: 15
                            }}
                        >
                            {
                                route.params.hidePlans && (
                                    <TouchableOpacity
                                        style={TITLE_VIEW}
                                        onPress={() => {
                                            Linking.openURL(`tel:${phoneNumber}`)
                                        }}
                                    >

                                        <Feather
                                            name="phone-call"
                                            color={colors.ravrPurple}
                                            size={20}
                                            style={{
                                                top: 10,
                                                right: 30

                                            }}
                                        />

                                    </TouchableOpacity>
                                )
                            }

                            <TouchableOpacity
                                style={TITLE_VIEW}
                                onPress={() => onShare()}
                            >
                                <Entypo
                                    name="share"
                                    color={colors.ravrPurple}
                                    size={20}
                                    style={{
                                        top: 10,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>

                    <Text

                        style={[DATE, { color: colors.blackTwo, fontFamily: fonts.RubikRegular }]}
                    >
                        {description}
                    </Text>

                    {loading && <ActivityIndicator size="small" color={colors.ravrPurple} />}

                    {
                        !route.params.hidePlans && (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={packages}
                                renderItem={returnPrices}
                                style={{
                                    paddingLeft: 15,
                                    height: Layout.window.height / 3,
                                }}
                                contentContainerStyle={{
                                    marginTop: 20,
                                    justifyContent: "space-between",
                                    paddingBottom: Layout.window.height / 6,
                                }}

                            />
                        )
                    }

                    {
                        route.params.hidePlans && (
                            <View
                                style={{
                                    // width: '90%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    // alignSelf: 'flex-end',
                                    marginHorizontal: 20
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.blackTwo,
                                        fontFamily: fonts.RubikMedium,
                                        // margin: 15,
                                    }}
                                >
                                    {translate('trips.attendees')} ({paymentList.length})
                                </Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('People', {
                                            trip: route.params.trip,
                                            hidePlans: true
                                        })
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.blue1,
                                            fontFamily: fonts.RubikMedium,
                                            fontSize: 12
                                        }}
                                    >
                                        {translate('trips.viewAll')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }

                    {
                        route.params.hidePlans && (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                data={paymentList}
                                renderItem={returnUsers}
                                style={{
                                    paddingLeft: 15,
                                    height: Layout.window.height / 3,
                                }}
                                contentContainerStyle={{
                                    marginTop: 20,
                                    justifyContent: "space-between",
                                    paddingBottom: Layout.window.height / 6,
                                }}

                            />
                        )
                    }




                </View>
            </View>

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
                                {name} - {selectedPackage.name}
                            </Text>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {selectedPackage.description} - {`₦ ${formatAmount(returnPrice(selectedPackage.price))}`}
                            </Text>
                        </View>
                    </View>

                    <Formik
                        initialValues={{
                            numberOfPeople: ""
                        }}
                        validationSchema={schema}
                        onSubmit={submit}
                        enableReinitialize
                        ref={p => (formikRef = p)}
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
                                        name="numberOfPeople"
                                        keyboardType="number-pad"
                                        placeholderTx="viewTrips.enterNumberOfPeople"
                                        value={values.numberOfPeople}
                                        onChangeText={handleChange("numberOfPeople")}
                                        onChange={(test) => {
                                            setTotalAmount(test.nativeEvent.text)
                                        }}
                                        onBlur={handleBlur("numberOfPeople")}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        isInvalid={!isValid}
                                        fieldError={errors.numberOfPeople}
                                        forwardedRef={i => {
                                            numberOfPeopleInput = i
                                        }}
                                    // onSubmitEditing={() => handleSubmit()}
                                    // maxLength={6}
                                    />

                                    <Text

                                        style={selectPaymentMethod}
                                    >
                                        Pay with
                                    </Text>


                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            width: '100%'
                                        }}
                                    >
                                        <TouchableOpacity
                                            disabled={!isValid || loading}
                                            style={{
                                                alignItems: 'center'
                                            }}
                                            onPress={() => {
                                                setPaymentMethod('paystack')
                                                handleSubmit()
                                            }}
                                        >
                                            <Image
                                                source={images.paystack}
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    borderRadius: 25,
                                                    alignItem: 'center'
                                                }}
                                                resizeMode={"contain"}
                                                resizeMethod="auto"

                                            />

                                            <Text
                                                style={paymentCompany}
                                            >
                                                Paystack
                                            </Text>
                                        </TouchableOpacity>

                                        {/* <TouchableOpacity
                                            disabled={!isValid || loading}
                                            onPress={() => {
                                                setPaymentMethod('wallet')
                                                handleSubmit()
                                            }}
                                            style={{
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Image
                                                source={images.walletAfrica}
                                                style={{
                                                    height: 50,
                                                    width: 50,
                                                    borderRadius: 25,
                                                }}
                                                resizeMode={"contain"}
                                                resizeMethod="auto"

                                            />

                                            <Text
                                                style={paymentCompany}
                                            >
                                                Wallet
                                            </Text>
                                        </TouchableOpacity> */}

                                        {
                                            // (totalAmount * returnPrice(selectedPackage.price)) <= 500000 && (
                                                <TouchableOpacity
                                                    disabled={!isValid || loading}
                                                    onPress={() => {
                                                        setPaymentMethod('flutterwave')
                                                        handleSubmit()
                                                    }}
                                                    style={{
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Image
                                                        source={images.flutterwave}
                                                        style={{
                                                            height: 50,
                                                            width: 50,
                                                            borderRadius: 25
                                                        }}
                                                        resizeMode={"contain"}
                                                        resizeMethod="auto"

                                                    />

                                                    <Text

                                                        style={paymentCompany}
                                                    >
                                                        Flutterwave
                                                    </Text>
                                                </TouchableOpacity>
                                            // )
                                        }


                                    </View>

                                    {
                                        loading && (
                                            <ActivityIndicator
                                                size="small"
                                                color={colors.ravrPurple}
                                                style={{
                                                    marginTop: Layout.window.height / 30
                                                }}
                                            />
                                        )
                                    }




                                    {/* <Button
                                        style={REDEEM_BUTTON}
                                        textStyle={REDEEM_BUTTON_TEXT}
                                        disabled={!isValid || loading}
                                        onPress={() => handleSubmit()}
                                    >
                                        {
                                            loading
                                                ? <ActivityIndicator size="small" color={colors.white} />
                                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`viewTrips.payWithWallet`, {
                                                    amount: formatAmount(totalAmount * returnPrice(selectedPackage.price))
                                                })}</Text>
                                        }
                                    </Button>

                                    <Button
                                        style={[REDEEM_BUTTON, { backgroundColor: '#606060', marginTop: 30 }]}
                                        textStyle={REDEEM_BUTTON_TEXT}
                                        disabled={!isValid || loading}
                                        onPress={() => handleSubmit()}
                                    >
                                        {
                                            loading
                                                ? <ActivityIndicator size="small" color={colors.white} />
                                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`viewTrips.payWithPaystack`, {
                                                    amount: formatAmount(totalAmount * returnPrice(selectedPackage.price))
                                                })}</Text>
                                        }
                                    </Button>

                                    <Button
                                        style={[REDEEM_BUTTON, { backgroundColor: '#ff654c', marginTop: 30 }]}
                                        textStyle={REDEEM_BUTTON_TEXT}
                                        disabled={!isValid || loading}
                                        onPress={() => handleSubmit()}
                                    >
                                        {
                                            loading
                                                ? <ActivityIndicator size="small" color={colors.white} />
                                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`viewTrips.payWithPaystack`, {
                                                    amount: formatAmount(totalAmount * returnPrice(selectedPackage.price))
                                                })}</Text>
                                        }
                                    </Button> */}

                                </View>
                            </View>
                        )}
                    </Formik>
                </View>
            </SlidingUpPanel>
        </KeyboardAvoidingView >
    )
}

export default ViewTrips
