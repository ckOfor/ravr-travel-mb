// react
import React, { useEffect, useRef, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ScrollView, RefreshControl,
    ImageBackground, Alert, Clipboard, TouchableOpacity, ActivityIndicator, Image, FlatList, Keyboard
} from "react-native";

// third-party
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useFocusEffect } from '@react-navigation/native';
import { formatAmount } from "../../utils/formatters";
import { createWalletPin, fetchTransactions, fetchWalletNalance, withdrawFromWallet } from "../../redux/auth";
import SlidingUpPanel from "rn-sliding-up-panel";
import moment from 'moment'
import { Feather, MaterialIcons } from '@expo/vector-icons';
import RNPickerSelect from "react-native-picker-select";

// redux
import useReduxStore from "../../utils/hooks/useRedux";

// components
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";

// util
import { translate } from "../../i18n";
import { Button } from "../../components/button";

const ROOT: ViewStyle = {
    // height: Layout.window.height,
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.window.width,
    backgroundColor: colors.white,
    // padding: 20
};

const SCROLL_ROOT: ViewStyle = {
    marginBottom: Platform.OS === "ios" ? 0 : Layout.window.height / 15
};

const HEADER_VIEW: ViewStyle = {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? Layout.window.height / 20 : 20,
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

const discoverTextStyle: TextStyle = {
    fontSize: 22,
    color: colors.black,
    fontFamily: fonts.RubikRegular,
    lineHeight: 40,
    textAlign: 'left',
    width: Layout.window.width / 1.5,
}

const discoverMoreTextStyle: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20
    // alignSelf: 'flex-start',
    // width: Layout.window.width / 1.5,
    // marginLeft: 20,
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
    pin: string
}

interface MyFormValuesWithdraw {
    amount: string
    accountNumber: string
}

interface StateProps {
    authSearchKey: string
}

const schema = Yup.object().shape({
    pin: Yup.string()
        .required("common.fieldRequired")
        .min(4, "common.amountSmall"),
})

const schemaWithdraw = Yup.object().shape({
    amount: Yup.number()
        .required("common.fieldRequired")
        .min(10, "common.amountLess"),
    accountNumber: Yup.string()
        .required("common.fieldRequired")
        .min(10, "common.accountLess"),
})

const Wallet = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const user = selectStore("user")
    const balance = selectStore("balance")
    const loading = selectStore("loading");
    const transactions = selectStore("transactions");
    const { wallets, hasPassword, fullName } = user
    const { accountName, bank, accountNumber, lockedFunds } = wallets[0]

    console.log(transactions, "transactions")

    // PROPS
    const [limit, setLimit] = useState(10)
    const [selectedAction, setSelectedAction] = useState('')
    const [showFullDetails, setShowFullDetails] = useState(true)
    let pinInput = useRef(null)
    let amountInput = useRef(null)
    let accountNumberInput = useRef(null)
    let slidingUpPanelRef = useRef<SlidingUpPanel>(null);
    const allBanks = [
        {
            id: "1",
            value: "Access Bank",
            label: "Access Bank",
            bankCode: "044",
        },
        {
            id: "2",
            value: "Citibank",
            label: "Citibank",
            bankCode: "023",
        },
        {
            id: "3",
            value: "Access Bank - Diamond Bank",
            label: "Diamond Bank",
            bankCode: "063",
        },
        {
            id: "4",
            value: "Dynamic Standard Bank",
            label: "Dynamic Standard Bank",
            bankCode: "",
        },
        {
            id: "5",
            value: "Ecobank Nigeria",
            label: "Ecobank Nigeria",
            bankCode: "050",
        },
        {
            id: "6",
            value: "Fidelity Bank Nigeria",
            label: "Fidelity Bank Nigeria",
            bankCode: "070",
        },
        {
            id: "7",
            value: "First Bank of Nigeria",
            label: "First Bank of Nigeria",
            bankCode: "011",
        },
        {
            id: "8",
            value: "First City Monument Bank",
            label: "First City Monument Bank",
            bankCode: "214",
        },
        {
            id: "9",
            value: "Guaranty Trust Bank",
            label: "Guaranty Trust Bank",
            bankCode: "058",
        },
        {
            id: "10",
            value: "Heritage Bank Plc",
            label: "Heritage Bank Plc",
            bankCode: "030",
        },
        {
            id: "11",
            value: "Jaiz Bank",
            label: "Jaiz Bank",
            bankCode: "301",
        },
        {
            id: "12",
            value: "Keystone Bank Limited",
            label: "Keystone Bank Limited",
            bankCode: "082",
        },
        {
            id: "13",
            value: "Providus Bank Plc",
            label: "Providus Bank Plc",
            bankCode: "101",
        },
        {
            id: "14",
            value: "Polaris Bank",
            label: "Polaris Bank",
            bankCode: "076",
        },
        {
            id: "15",
            value: "Stanbic IBTC Bank Nigeria Limited",
            label: "Stanbic IBTC Bank Nigeria Limited",
            bankCode: "221",
        },
        {
            id: "16",
            value: "Standard Chartered Bank",
            label: "Standard Chartered Bank",
            bankCode: "068",
        },
        {
            id: "17",
            value: "Sterling Bank",
            label: "Sterling Bank",
            bankCode: "232",
        },
        {
            id: "18",
            value: "Suntrust Bank Nigeria Limited",
            label: "Suntrust Bank Nigeria Limited",
            bankCode: "100",
        },
        {
            id: "19",
            value: "Union Bank of Nigeria",
            label: "Union Bank of Nigeria",
            bankCode: "032",
        },
        {
            id: "20",
            value: "United Bank for Africa",
            label: "United Bank for Africa",
            bankCode: "033",
        },
        {
            id: "21",
            value: "Unity Bank Plc",
            label: "Unity Bank Plc",
            bankCode: "215",
        },
        {
            id: "22",
            value: "Wema Bank",
            label: "Wema Bank",
            bankCode: "035",
        },
        {
            id: "23",
            value: "Zenith Bank",
            label: "Zenith Bank",
            bankCode: "057",
        },
        {
            id: "24",
            value: "Unity Bank",
            label: "Unity Bank",
            bankCode: "215",
        },
        {
            id: "25",
            value: "Rolez Microfinance Bank",
            label: "Rolez Microfinance Bank",
            bankCode: "993",
        },
        {
            id: "26",
            value: "ASO Savings",
            bankCode: "041",
        },
        {
            id: "27",
            value: "Coronation Merchant Bank",
            label: "Coronation Merchant Bank",
            bankCode: "559",
        },
        {
            id: "28",
            value: "FBN Merchant Bank",
            label: "FBN Merchant Bank",
            bankCode: "911",
        },
        {
            id: "29",
            value: "FSDH",
            lable: "FSDH",
            bankCode: "501",
        },
        {
            id: "30",
            value: "Globus Bank",
            label: "Globus Bank",
            bankCode: "103",
        },
        {
            id: "31",
            value: "JAIZ Bank",
            label: "JAIZ Bank",
            bankCode: "301",
        },
        {
            id: "32",
            value: "Jubilee Life Mortgage Bank",
            label: "Jubilee Life Mortgage Bank",
            bankCode: "402",
        },
        {
            id: "33",
            value: "Mkudi",
            label: "Mkudi",
            bankCode: "313",
        },
        {
            id: "34",
            value: "New Prudential Bank",
            label: "New Prudential Bank",
            bankCode: "561",
        },
        {
            id: "35",
            value: "Pagatech",
            label: "Pagatech",
            bankCode: "327",
        },
        {
            id: "36",
            value: "Providus Bank",
            label: "Providus Bank",
            bankCode: "101",
        },
        {
            id: "37",
            value: "Rand Merchant Bank",
            label: "Rand Merchant Bank",
            bankCode: "502",
        },
        {
            id: "38",
            value: "SafeTrust Mortgage Bank",
            label: "SafeTrust Mortgage Bank",
            bankCode: "403",
        },
        {
            id: "39",
            value: "SUNTRUST BANK",
            label: "SUNTRUST BANK",
            bankCode: "100",
        },
        {
            id: "40",
            value: "TagPay",
            label: "TagPay",
            bankCode: "328",
        },
        {
            id: "40",
            value: "Taj Bank",
            label: "Taj Bank",
            bankCode: "302",
        },
        {
            id: "41",
            value: "TITAN TRUST BANK",
            label: "TITAN TRUST BANK",
            bankCode: "102",
        },
    ];
    const [selectedBank, setselectedBank] = useState([]);
    const [selectedBankCode, setSelectedBankCode] = useState("");
    const placeholderBanks = {
        label: "Select bank",
        value: "",
        color: "#565F62",
    };


    // LIFECYCLE
    useFocusEffect(
        React.useCallback(() => {
            hasPassword && dispatch(fetchTransactions(limit))
            dispatch(fetchWalletNalance())

            if (!hasPassword) {
                setTimeout(() => {
                    // slidingUpPanelRef.current.show()
                    setSelectedAction("createPassword")
                }, 3000)
            }

            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor(colors.ravrPurple)
                StatusBar.setBarStyle("light-content")
            } else {
                StatusBar.setBarStyle("dark-content")
            }

        }, [])
    );

    const submit = ({ pin }) => {
        console.log(pin)
        dispatch(createWalletPin(pin))
    }

    const validateAndWithdraw = ({ amount, accountNumber }) => {
        console.log(amount)
        console.log(accountNumber)
        const payload = {
            withdrawAmount: amount,
            accountNumber,
            accountName: fullName,
            bankCode: selectedBankCode
        }
        dispatch(withdrawFromWallet(payload))
    }

    const renderPrice = ({ item }: any, index: any) => {

        const { type, category, amount, dateTransacted, currency, previousBalance } = item
        console.log(item)

        return (
            <View
                style={{
                    padding: 10,
                    backgroundColor: 'rgba(218, 226, 234, 0.32);',
                    marginBottom: 15,
                    borderRadius: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: Layout.window.width / 1.1
                }}
            >

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Image source={type === "Debit" ? images.debitIcon : images.creditIcon} style={{ width: 40, height: 40 }} />

                    <View
                        style={{
                            marginLeft: 20,
                        }}
                    >

                        <Text
                            style={{
                                color: '#1D1D1D',
                                fontSize: 12
                            }}
                        >
                            {category}
                        </Text>

                        <Text
                            style={{
                                color: '#000000',
                                fontSize: 12,
                                marginTop: 5,
                            }}
                        >
                            Prev Bal: {formatAmount(previousBalance)}
                        </Text>

                    </View>
                </View>

                <View
                    style={{
                        marginLeft: 20,
                    }}
                >

                    <Text
                        style={{
                            color: '#1D1D1D',
                            fontSize: 12,
                            textAlign: 'right'
                        }}
                    >
                        {currency} {formatAmount(amount)}
                    </Text>

                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 12,
                            marginTop: 5,
                            textAlign: 'right'
                        }}
                    >
                        {`${moment(dateTransacted).format('Do ddd MM hh:mm a')}`}
                    </Text>

                </View>

            </View>
        )
    }

    return (
        <View
            enabled={true}
            style={{
                backgroundColor: colors.white,
            }}
            behaviour="height"
        >
            <View
                style={ROOT}
            >
                <View
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {

                            }}
                        />
                    }
                    style={SCROLL_ROOT}
                    bounces={false}
                    scrollEnabled={false}
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
                                {translate(`wallet.Manage`)}
                            </Text>
                        </View>

                    </View>

                    {
                        showFullDetails && (
                            <Text

                                style={DISCOVER_MORE}
                            >
                                {translate(`wallet.manageBody`)}
                            </Text>
                        )
                    }

                    <TouchableOpacity
                        onPress={() => {
                            setSelectedAction('')
                            setShowFullDetails(!showFullDetails)
                        }}
                    >
                        <ImageBackground
                            style={{
                                width: Layout.window.width / 1.1,
                                height: showFullDetails ? 221 : 100,
                                marginTop: 20,
                                padding: 20,
                            }}
                            source={images.cardBackground}
                            imageStyle={{ borderRadius: 10 }}

                        >

                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%'
                                }}
                            >
                                <View>
                                    <Text

                                        style={{
                                            color: colors.white,
                                            fontFamily: fonts.RubikRegular,
                                            fontSize: 10,
                                        }}
                                    >
                                        {translate('wallet.account').toString().toUpperCase()}
                                    </Text>

                                    <Text

                                        style={{
                                            color: colors.white,
                                            fontFamily: fonts.RubikBold,
                                            marginTop: 7,
                                            fontSize: 24
                                        }}
                                    >
                                        {balance?.walletCurrency} {`${formatAmount(balance?.walletBalance)}`}
                                    </Text>
                                </View>

                                {
                                    showFullDetails && (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <View>
                                                <Text

                                                    style={{
                                                        color: colors.white,
                                                        fontFamily: fonts.RubikRegular,
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {translate('wallet.amountWithWallet')}
                                                </Text>

                                                <Text

                                                    style={{
                                                        color: colors.white,
                                                        fontFamily: fonts.RubikBold,
                                                        marginTop: 7,
                                                        fontSize: 15
                                                    }}
                                                >
                                                    {accountName}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text

                                                    style={{
                                                        color: colors.white,
                                                        fontFamily: fonts.RubikRegular,
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {translate('wallet.bankName')}
                                                </Text>

                                                <Text

                                                    style={{
                                                        color: colors.white,
                                                        fontFamily: fonts.RubikBold,
                                                        marginTop: 7,
                                                        fontSize: 15
                                                    }}
                                                >
                                                    {bank}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                }

                                {
                                    showFullDetails && (<View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <View>
                                            <Text

                                                style={{
                                                    color: colors.white,
                                                    fontFamily: fonts.RubikRegular,
                                                    fontSize: 10,
                                                }}
                                            >
                                                {translate('wallet.lockedFunds')}
                                            </Text>

                                            <Text

                                                style={{
                                                    color: colors.white,
                                                    fontFamily: fonts.RubikBold,
                                                    marginTop: 7,
                                                    fontSize: 15
                                                }}
                                            >
                                                {balance?.walletCurrency} {`${formatAmount(lockedFunds)}`}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => {
                                                Clipboard.setString(accountNumber);
                                                Alert.alert(
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
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Feather
                                                name="copy"
                                                size={24}
                                                color="white"
                                            />

                                            <Text

                                                style={{
                                                    color: colors.white,
                                                    fontFamily: fonts.RubikBold,
                                                    margin: 7,
                                                    fontSize: 15
                                                }}
                                            >
                                                {translate('wallet.copy')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>)
                                }
                            </View>

                        </ImageBackground>
                    </TouchableOpacity>

                    <View
                        style={{
                            marginHorizontal: 20,
                            marginVertical: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-around'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                borderRadius: 28,
                            }}
                            onPress={() => {
                                setSelectedAction('transaction')
                                setShowFullDetails(false)
                            }}
                        >
                            <Image
                                source={images.history}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                borderRadius: 28,
                            }}
                            onPress={() => {
                                setSelectedAction('withdraw')
                                setShowFullDetails(false)
                            }}
                        >
                            <Image
                                source={images.withdraw}
                            />
                        </TouchableOpacity>



                        <TouchableOpacity
                            style={{
                                borderRadius: 28,
                                backgroundColor: '#efedef',
                                height: 56,
                                width: 56,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                setSelectedAction('createPassword')
                                setShowFullDetails(false)
                            }}
                        >
                            <MaterialIcons
                                name="security"
                                size={28}
                            // color="#F24040"
                            />
                        </TouchableOpacity>
                    </View>

                    {
                        selectedAction === "transaction" && <FlatList
                            showsVerticalScrollIndicator={false}
                            data={transactions}
                            renderItem={renderPrice}
                            onEndReachedThreshold={0.5}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    progressBackgroundColor={'transparent'}
                                    style={{
                                        // margin: 0,
                                        // padding: 0,
                                    }}
                                    onRefresh={() => {
                                        setLimit(10)
                                        dispatch(fetchTransactions(10))
                                    }}
                                />
                            }
                            onEndReached={() => {
                                setLimit(limit + 10)
                                dispatch(fetchTransactions(limit + 10))
                            }}
                            ListEmptyComponent={
                                <View
                                    style={{
                                        marginTop: Layout.window.height / 5,
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
                                paddingBottom: Layout.window.height / 1.05,
                                // marginHorizontal: 40
// 
                            }}
                            
                        />
                    }

                </View>


            </View>


            {
                selectedAction === "createPassword" && (
                    <View
                        style={{
                            height: Layout.window.height,
                            backgroundColor: colors.white,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            padding: 20,
                        }}
                    >

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                            // onPress={() => navigation.navigate('Redeem')}
                            >
                                <Text

                                    style={discoverTextStyle}
                                >
                                    {hasPassword ? translate(`wallet.editPin`) : translate(`wallet.createPin`)}
                                </Text>

                                <Text

                                    style={discoverMoreTextStyle}
                                >
                                    {translate(`wallet.createPinBody`)}
                                </Text>
                            </View>


                        </View>

                        <Formik
                            initialValues={{
                                pin: ""
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
                                            name="pin"
                                            keyboardType="number-pad"
                                            placeholderTx="wallet.enterPin"
                                            value={values.pin}
                                            onChangeText={handleChange("pin")}
                                            onBlur={handleBlur("pin")}
                                            autoCapitalize="none"
                                            returnKeyType="done"
                                            isInvalid={!isValid}
                                            fieldError={errors.pin}
                                            forwardedRef={i => {
                                                pinInput = i
                                            }}
                                            // onSubmitEditing={() => handleSubmit()}
                                            maxLength={4}
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
                )
            }

            <KeyboardAvoidingView
                enabled={true}
                style={{
                    backgroundColor: colors.white,
                    height: '100%'
                }}
                behaviour="height"
            >

                <ScrollView
                    style={{
                        backgroundColor: colors.white,
                        height: '100%'
                    }}
                    showsVerticalScrollIndicator={false}
                >

                    {
                        selectedAction === "withdraw" && (
                            <View
                                style={{
                                    height: Layout.window.height,
                                    backgroundColor: colors.white,
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                    padding: 20,
                                }}
                            >

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View>
                                        <Text

                                            style={discoverTextStyle}
                                        >
                                            {translate(`wallet.withdraw`)}
                                        </Text>

                                        <Text

                                            style={discoverMoreTextStyle}
                                        >
                                            {translate(`wallet.withdrawBody`)}
                                        </Text>
                                    </View>


                                </View>

                                <Formik
                                    initialValues={{
                                        amount: ""
                                    }}
                                    validationSchema={schemaWithdraw}
                                    onSubmit={validateAndWithdraw}
                                    enableReinitialize
                                >
                                    {({
                                        values,
                                        handleChange,
                                        handleBlur,
                                        errors,
                                        isValid,
                                        handleSubmit
                                    }: FormikProps<MyFormValuesWithdraw>) => (
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
                                                    placeholderTx="wallet.withdrawAmount"
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
                                                    maxLength={4}
                                                />



                                                <RNPickerSelect
                                                    items={allBanks}
                                                    onValueChange={value => {
                                                        if (allBanks.filter(e => e.value === value).length > 0) {
                                                            allBanks.filter(e => {
                                                                if (e.value === value) {
                                                                    console.log(e)
                                                                    setSelectedBankCode(e.bankCode)
                                                                }
                                                            }).length > 0
                                                            setselectedBank(value)
                                                        }
                                                    }}
                                                    value={selectedBank}
                                                    useNativeAndroidPickerStyle={false}
                                                    textInputProps={{
                                                        // color: colors.companyDarkGreen,
                                                        // fontFamily: fonts.gilroyLight,
                                                    }}
                                                    // disabled={amount.length < 2 || amount.join("") < 2}
                                                    placeholder={placeholderBanks}
                                                >

                                                    <TextField
                                                        name="amount"
                                                        keyboardType="number-pad"
                                                        placeholderTx="wallet.selectBank"
                                                        value={selectedBank}
                                                        // onSubmitEditing={() => handleSubmit()}
                                                        maxLength={10}
                                                        minLength={10}
                                                        // editable={false}
                                                        onFocus={() => {
                                                            Keyboard.dismiss()
                                                            console.log("pressed")
                                                        }}
                                                    />

                                                </RNPickerSelect>

                                                <TextField
                                                    name="accountNumber"
                                                    keyboardType="number-pad"
                                                    placeholderTx="wallet.accountNumnber"
                                                    value={values.accountNumber}
                                                    onChangeText={handleChange("accountNumber")}
                                                    onBlur={handleBlur("accountNumber")}
                                                    autoCapitalize="none"
                                                    returnKeyType="done"
                                                    isInvalid={!isValid}
                                                    fieldError={errors.accountNumber}
                                                    forwardedRef={i => {
                                                        accountNumberInput = i
                                                    }}
                                                    // onSubmitEditing={() => handleSubmit()}
                                                    maxLength={10}
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
                                                            : <Text style={REDEEM_BUTTON_TEXT}>{translate(`wallet.withdraw`)}</Text>
                                                    }
                                                </Button>
                                            </View>
                                        </View>
                                    )}
                                </Formik>


                            </View>
                        )
                    }

                </ScrollView>


            </KeyboardAvoidingView>


        </View >
    )
}

export default Wallet
