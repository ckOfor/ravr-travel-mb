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

// redux
import { payForTrip } from "../../redux/auth";
import useReduxStore from "../../utils/hooks/useRedux";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts } from "../../theme";

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
    lineHeight: 22,
    textAlign: 'left',
    width: Layout.window.width / 1.9,
}

const DISCOVER_MORE: TextStyle = {
    color: colors.blackTwo,
    fontFamily: fonts.RubikMedium,
    width: Layout.window.width / 1.2,
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
    lineHeight: 25,
    fontSize: 15,
}

const discoverTextStyle: TextStyle = {
    fontSize: 22,
    color: colors.black,
    fontFamily: fonts.RubikRegular,
    lineHeight: 40,
    textAlign: 'left',
    width: Layout.window.width / 1.5,
    marginBottom: 10
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

const People = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("loading");
    const user = selectStore("user");

    const {
        location, name, imageOne, imageTwo, imageThree, poster, startDate, endDate, packages, description, id,
        ravrPercentage, phoneNumber, paymentList
    } = route.params.trip


    console.log(route.params.trip, "paymentList")
    // PROPS
    const [tripStartDate, setTripStartDate] = useState('')
    const [tripEndDate, setTripEndDate] = useState('')
    const [dateDiff, setDateDiff] = useState('')
    const [selectedPackage, setSelectedPackage] = useState([])
    let slidingUpPanelRef = useRef<SlidingUpPanel>(null);
    let numberOfPeopleInput = useRef(null)
    let formikRef = useRef(null)
    console.log(route.params.trip, "route.params.trip")
    const [totalAmount, setTotalAmount] = useState('')

    const [selectedUser, setSelectedUser] = useState([])


    console.log(user)

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
        console.log(startDate, "<=== startDate")
        console.log(endDate, "<=== endDate")

        const firstTwoStart = parseInt(startDate.substring(0, 2))
        const firstTwoEnd = parseInt(startDate.substring(0, 2))

        const middleTwoStart = parseInt(startDate.substring(3, 6))
        const middleTwoEnd = parseInt(startDate.substring(3, 6))

        console.log(middleTwoStart, "<=== startDate")
        console.log(middleTwoEnd, "<=== endDate")


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



        console.log(tripStartDate); // Gives day count of difference
        console.log(tripEndDate); // Gives day count of difference
        console.log(dateDiff); // Gives day count of difference
        // 4
    }

    const submit = (values: any) => {
        // downlaodUsers()
        // console.log(formikRef.current)
        const { numberOfPeople } = values

        const payload = {
            tripId: id,
            numberOfPeople,
            selectedPackage
        }

        dispatch(payForTrip(payload))
        // console.log(payload, "<== payload")
    }


    const returnUsers = ({ item }) => {
        const { picture, packagePrice, name, packageName, numberOfPeople } = item

        console.log(item)

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
                                right: 20
                            }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setSelectedUser(item)
                            slidingUpPanelRef.current.show()
                        }}
                    >
                        <AntDesign
                            name="eye"
                            color={colors.ravrPurple}
                            size={26}
                            style={{
                                top: 4,
                            }}
                        />
                    </TouchableOpacity>



                </View>

            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
        // behavior={"padding"}
        // keyboardVerticalOffset={100}
        >
            <View
                style={ROOT}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    style={SCROLL_ROOT}
                >
                    <View
                        style={{
                            marginHorizontal: 15
                        }}
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
                                    {translate(`viewTrips.header`)}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={TITLE_VIEW}
                                onPress={() => navigation.goBack()}
                            >
                                <MaterialCommunityIcons
                                    name="keyboard-backspace"
                                    color={colors.ravrPurple}
                                    size={26}
                                    style={{
                                        top: 6,
                                    }}
                                />

                                {/* <Text

                                    style={DISCOVER}
                                >
                                    {translate(`myTrips.postTour`)}
                                </Text> */}

                            </TouchableOpacity>

                        </View>

                        <Text

                            style={DISCOVER_MORE}
                        >
                            {location}
                        </Text>


                    </View>

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




                </ScrollView>
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
                            <View>
                                <Text

                                    style={discoverTextStyle}
                                >
                                    {translate(`trips.contect`)}
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '95%'
                                }}
                            >
                                <Text

                                    style={discoverMoreTextStyle}
                                >
                                    {translate(`trips.email`)}: {selectedUser.email}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`mailto:${selectedUser.email}`)}
                                >
                                    <MaterialCommunityIcons
                                        name="email"
                                        color={colors.ravrPurple}
                                        size={26}
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`trips.phone`)}: {selectedUser.phoneNumber}
                            </Text>

                            <Text

                                style={[discoverTextStyle, { marginTop: 20 }]}
                            >
                                {translate(`trips.package`)}
                            </Text>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`trips.name`)}: {selectedUser.packageName}
                            </Text>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`trips.amount`)}: {`₦ ${formatAmount(returnPrice(selectedUser.packagePrice * selectedUser.numberOfPeople))}`}
                            </Text>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`trips.people`)}: {`${selectedUser.numberOfPeople}`}
                            </Text>

                            <Text

                                style={[discoverTextStyle, { marginTop: 20 }]}
                            >
                                {translate(`trips.payment`)}
                            </Text>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`trips.reference`)}: {`${selectedUser.reference}`}
                            </Text>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`trips.date`)}: {`${moment(selectedUser.paymentDate).format('Do dddd MMM hh:mm a')}`}
                            </Text>
                        </View>
                    </View>


                </View>
            </SlidingUpPanel>
        </KeyboardAvoidingView >
    )
}

export default People
