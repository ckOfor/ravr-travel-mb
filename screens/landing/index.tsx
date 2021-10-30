// react
import React, { useEffect, useRef, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ScrollView, RefreshControl,
    Pressable, FlatList, TouchableOpacity, Image, ImageBackground, Share
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
import { colors, fonts, images } from "../../theme";

// util
import { translate } from "../../i18n";
import useReduxStore from "../../utils/hooks/useRedux";
import { fetchLocalTrips, fetchPopularTrips, fetchTrendingTrips, redeemCoupon } from "../../redux/auth";

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
    marginTop: Platform.OS === "ios" ? Layout.window.height / 20 : 25,
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
    // fontSize: 20,
    color: colors.white,
    fontFamily: fonts.RubikMedium,
    textAlign: 'left',
    // marginLeft: 10
}

const TRIP_DATE: TextStyle = {
    // fontSize: 15,
    color: colors.white,
    fontFamily: fonts.RubikRegular,
    textAlign: 'left',
    // marginLeft: 10
    // marginTop: 5
}

const TRIP_DESCRIPTION: TextStyle = {
    // fontSize: 18,
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

const LandingPage = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("auth");
    const popular = selectStore("popular");
    const trending = selectStore("trending");
    const local = selectStore("local");


    // PROPS
    let searchKeyInput = useRef(null)

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
        dispatch(fetchPopularTrips(10))
        dispatch(fetchTrendingTrips(10))
        dispatch(fetchLocalTrips(10))
    }, [])

    const submit = (value: string) => {
        console.log(value)
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

    const returnPopular = ({ item }) => {
        const { poster, location, name, startDate } = item

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('ViewTrips', {
                        trip: item
                    })
                }}
            >

                <ImageBackground
                    style={{
                        height: Layout.window.height / 3,
                        width: Layout.window.width / 2.5,
                        marginRight: 20,
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

                <Text

                    style={[TRIP_DESCRIPTION, { color: colors.ravrPurple, fontFamily: fonts.RubikMedium }]}
                >
                    {location}
                </Text>

            </TouchableOpacity>
        )
    }

    const returnTrending = ({ item }) => {
        const { poster, location, name, startDate } = item

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('ViewTrips', {
                        trip: item
                    })
                }}
            >

                <ImageBackground
                    style={{
                        height: Layout.window.height / 10,
                        width: Layout.window.width / 2.5,
                        marginRight: 20,
                        // paddingVertical: 20,
                        paddingHorizontal: 10,
                        justifyContent: "space-between"
                    }}
                    source={{ uri: poster }}
                    imageStyle={{
                        borderRadius: 8
                    }}
                    resizeMode="cover"
                    resizeMethod="auto"
                />

                <Text

                    style={[TRIP_DESCRIPTION, { color: colors.ravrPurple, fontFamily: fonts.RubikMedium }]}
                >
                    {location}
                </Text>

            </TouchableOpacity>
        )
    }

    const returnLocal = ({ item }) => {
        const { poster, location, name, startDate } = item

        return (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('ViewTrips', {
                        trip: item
                    })
                }}
            >

                <ImageBackground
                    style={{
                        height: Layout.window.height / 5,
                        width: Layout.window.width / 2.3,
                        marginRight: 20,
                        paddingVertical: 20,
                        paddingHorizontal: 10,
                        justifyContent: "space-between",
                        marginTop: 20
                    }}
                    source={{ uri: poster }}
                    imageStyle={{
                        borderRadius: 8
                    }}
                    resizeMode="cover"
                    resizeMethod="auto"
                />

                <Text

                    style={[TRIP_DESCRIPTION, { color: colors.ravrPurple, fontFamily: fonts.RubikMedium }]}
                >
                    {name}
                </Text>

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
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {
                                dispatch(fetchPopularTrips(10))
                                dispatch(fetchTrendingTrips(10))
                                dispatch(fetchLocalTrips(10))
                            }}
                        />
                    }
                    // bounces={false}
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
                                            forwardedRef={searchKeyInput}
                                            placeholderTextColor={colors.faddedGrey}
                                            onSubmitEditing={() => handleSubmit()}
                                            onFocus={() => {
                                                searchKeyInput.current.blur()
                                                navigation.navigate('Trips')

                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>

                    {
                        popular && popular.length > 0 && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: "space-between",
                                    marginHorizontal: 20,
                                    marginLeft: 15,

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
                                    onPress={() => navigation.navigate('AllTrips', {
                                        mode: 'popular'
                                    })}
                                    style={POPULAR_PLACES}
                                >
                                    <Text

                                        style={MORE}
                                    >
                                        {translate(`landing.more`)}
                                    </Text>
                                </Pressable>
                            </View>
                        )
                    }

                    <View
                        style={{
                            // marginBottom: Layout.window.height / 13,
                            marginHorizontal: 0,
                            width: Layout.window.width,
                            paddinHorizonatal: 10
                        }}
                    >
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={popular}
                            renderItem={returnPopular}
                            style={{
                                // marginBottom: Layout.window.height / 20,
                                paddingLeft: 15,
                                // marginRight: 20,
                            }}
                            horizontal
                            contentContainerStyle={{
                                marginTop: 20,
                                justifyContent: "space-between"
                            }}

                        />
                    </View>

                    {
                        trending && trending.length > 0 && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: "space-between",
                                    margin: 20,
                                    marginLeft: 15,

                                }}
                            >
                                <View
                                    style={POPULAR_PLACES}
                                >
                                    <Text

                                        style={POPULAR_PLACES_TEXT}
                                    >
                                        {translate(`landing.trendingCities`)}
                                    </Text>
                                </View>

                                <Pressable
                                    style={POPULAR_PLACES}
                                    onPress={() => navigation.navigate('AllTrips', {
                                        mode: 'trending'
                                    })}
                                >
                                    <Text

                                        style={MORE}
                                    >
                                        {translate(`landing.more`)}
                                    </Text>
                                </Pressable>
                            </View>
                        )
                    }

                    <View
                        style={{
                            // marginBottom: Layout.window.height / 13,
                            marginHorizontal: 0,
                            width: Layout.window.width,
                            // paddinHorizonatal: 10
                        }}
                    >
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={trending}
                            renderItem={returnTrending}
                            style={{
                                // marginBottom: Layout.window.height / 5,
                                paddingLeft: 15,
                                // marginRight: 20,
                            }}
                            horizontal
                            contentContainerStyle={{
                                // marginTop: 30,
                                justifyContent: "space-between"
                            }}

                        />
                    </View>

                    {
                        local && local.length > 0 && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: "space-between",
                                    marginHorizontal: 20,
                                    marginTop: 20,
                                    marginLeft: 15,
                                }}
                            >
                                <View
                                    style={POPULAR_PLACES}
                                >
                                    <Text

                                        style={POPULAR_PLACES_TEXT}
                                    >
                                        {translate(`landing.localCities`)}
                                    </Text>
                                </View>

                                <Pressable
                                    style={POPULAR_PLACES}
                                    onPress={() => navigation.navigate('AllTrips', {
                                        mode: 'local'
                                    })}
                                >
                                    <Text

                                        style={MORE}
                                    >
                                        {translate(`landing.more`)}
                                    </Text>
                                </Pressable>
                            </View>
                        )
                    }

                    <View
                        style={{
                            marginBottom: Layout.window.height / 8,
                            marginHorizontal: 0,
                            width: Layout.window.width,
                            paddinHorizonatal: 10
                        }}
                    >
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={local}
                            renderItem={returnLocal}
                            style={{
                                // marginBottom: Layout.window.height / 5,
                                paddingLeft: 15,
                                // marginRight: 20,
                            }}
                            contentContainerStyle={{
                                // marginTop: 30,
                                justifyContent: "space-between"
                            }}
                            numColumns={2}

                        />
                    </View>

                </ScrollView>
            </View>
        </KeyboardAvoidingView >
    )
}

export default LandingPage
