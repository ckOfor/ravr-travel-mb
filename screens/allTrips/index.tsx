// react
import React, { useEffect, useRef, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ScrollView, RefreshControl,
    Pressable, FlatList, TouchableOpacity, Image, ImageBackground, Share, ActivityIndicator
} from "react-native";

// third-party
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome, Entypo, MaterialIcons } from 'react-native-vector-icons';
import DatePicker from "react-native-datepicker";

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
import { fetchLocalTrips, fetchPopularTrips, fetchTrendingTrips, redeemCoupon, searchForTrip } from "../../redux/auth";

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
    lineHeight: 40,
    textAlign: 'left',
    width: Layout.window.width / 1.9,
}

const DISCOVER_MORE: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20,
    width: Layout.window.width / 1.2,
    marginVertical: 10
}

const POPULAR_PLACES: TextStyle = {
    flexDirection: "row",
    justifyContent: 'space-between',
}

const POPULAR_PLACES_TEXT: TextStyle = {
    fontSize: 22,
    color: colors.blackTwo,
    fontFamily: fonts.RubikMedium,
    lineHeight: 30,
    textAlign: 'left',
}

const MORE: TextStyle = {
    fontSize: 14,
    color: colors.faddedGrey,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20,
    textAlign: 'left',
}

const TRIP_HEADER: TextStyle = {
    fontSize: 20,
    color: colors.white,
    fontFamily: fonts.RubikMedium,
    textAlign: 'left',
    // marginLeft: 10
}

const TRIP_DATE: TextStyle = {
    fontSize: 15,
    color: colors.white,
    fontFamily: fonts.RubikRegular,
    textAlign: 'left',
    // marginLeft: 10
    // marginTop: 5
}

const TRIP_DESCRIPTION: TextStyle = {
    fontSize: 18,
    color: colors.white,
    fontFamily: fonts.RubikRegular,
    textAlign: 'left',
    marginTop: 10
}


const TRIP_LOCATION: TextStyle = {
    fontSize: 18,
    color: colors.blackTwo,
    fontFamily: fonts.RubikMedium,
    textAlign: 'left',
    marginLeft: 10
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

const AllTrips = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("auth");
    const [limit, setLimit] = useState(10)
    const popular = selectStore("popular");
    const trending = selectStore("trending");
    const local = selectStore("local");

    const searchResults = selectStore("searchResults");
    console.log(searchResults, "searchResults")


    // PROPS
    let searchKeyInput = useRef(null)
    const [searchKey, setsearchKey] = useState('')
    const [data, setData] = useState('')
    const searchKeyPicker = useRef(null)

    // LIFECYCLE
    useFocusEffect(
        React.useCallback(() => {
            console.log(route.params.mode)

            if (route.params.mode === "popular") {
                console.log("poplular1 ===>", limit)
                setData(popular)
            }

            if (route.params.mode === "trending") {
                console.log("trending2 ===>", limit)
                setData(trending)
            }

            if (route.params.mode === "local") {
                console.log("local3 ===>", limit)
                setData(local)
            }

            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor(colors.ravrPurple)
                StatusBar.setBarStyle("light-content")
            } else {
                StatusBar.setBarStyle("dark-content")
            }

        }, [])
    );

    const submit = (searchKey: string) => {
        console.log(searchKey)
        dispatch(searchForTrip(searchKey, limit))
    }

    const onShare = async (item: any) => {
        const { poster, location, name, startDate, endDate } = item

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

    const renderTrip = ({ item }) => {
        const { poster, location, name, startDate } = item

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('ViewTrips', {
                        trip: item
                    })
                }}
                style={{
                    marginVertical: 20
                }}
            >

                <ImageBackground
                    style={{
                        height: Layout.window.height / 3,
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                        justifyContent: "space-between"
                    }}
                    source={{ uri: poster }}
                    imageStyle={{
                        borderRadius: 8
                    }}
                    resizeMode="cover"
                    resizeMethod="auto"
                >
                    <TouchableOpacity
                        onPress={() => onShare(item)}

                        style={{
                            height: 50,
                            width: 100,
                        }}
                    >
                        <Image
                            source={images.shareIcon}
                            resizeMode="contain"
                            resizeMethod="auto"
                        />
                    </TouchableOpacity>

                    <View>
                        <Text

                            style={TRIP_HEADER}
                        >
                            {name}
                        </Text>

                        <Text

                            style={TRIP_DESCRIPTION}
                        >
                            {location}
                        </Text>

                        <Text

                            style={TRIP_DATE}
                        >
                            {`${startDate}`}
                        </Text>
                    </View>

                </ImageBackground>

            </TouchableOpacity>
        )
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
                    bounces={false}
                    style={SCROLL_ROOT}
                    scrollEnabled={false}
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
                                    {translate(`trips.header`)}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack()
                                }}
                                style={{
                                    top: 10
                                }}
                            >
                                <MaterialIcons
                                    name="keyboard-backspace"
                                    color={colors.ravrPurple}
                                    size={26}
                                />
                            </TouchableOpacity>

                        </View>

                        <Text

                            style={DISCOVER_MORE}
                        >
                            {translate(`trips.body`)}
                        </Text>
                    </View>

                    <View
                        style={{
                            marginHorizontal: 20
                        }}
                    >


                        <View style={{ height: Layout.window.height / 1.3 }}>
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={() => {
                                    console.log("route.params.mode ===>", route.params.mode)
                                    setLimit(limit + 10)
                                    if (route.params.mode === "popular") {
                                        console.log("poplular ===>", limit)
                                        return dispatch(fetchPopularTrips(limit + 10))
                                    }

                                    if (route.params.mode === "trending") {
                                        console.log("trending ===>", limit)
                                        return dispatch(fetchTrendingTrips(limit + 10))
                                    }

                                    if (route.params.mode === "local") {
                                        console.log("local ===>", limit)
                                        return dispatch(fetchLocalTrips(limit + 10))
                                    }
                                }}
                                onEndReachedThreshold={0.01}
                                ListFooterComponent={() => loading ? <ActivityIndicator /> : null}
                                renderItem={renderTrip}
                                style={{
                                    marginBottom: Layout.window.height / 10
                                }}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>


                    </View>

                    <DatePicker
                        style={{
                            height: 1,
                            width: 1
                        }}
                        ref={searchKeyPicker}
                        showIcon={false}
                        hideText={true}
                        date={searchKey}
                        androidMode="spinner"
                        mode="date"
                        confirmBtnText="OK"
                        cancelBtnText="CANCEL"
                        format="DD-MM-YYYY"
                        onDateChange={date => {
                            setsearchKey(date);
                            dispatch(searchForTrip(date, limit))
                        }}
                        // maxDate={moment().subtract(18, "years")}
                        minDate={new Date(Date.now())}
                    />

                </ScrollView>
            </View>
        </KeyboardAvoidingView >
    )
}

export default AllTrips
