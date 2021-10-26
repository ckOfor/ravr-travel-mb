// react
import React, { useEffect, useState, useRef } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ScrollView, RefreshControl,
    TouchableOpacity, ActivityIndicator, Keyboard, Linking, Alert
} from "react-native";

// third-party
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, AntDesign, MaterialIcons } from 'react-native-vector-icons';
import SlidingUpPanel from "rn-sliding-up-panel";
import RNPickerSelect from "react-native-picker-select";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {
    CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_URL
} from "@env"
import { appDetailsSettings } from "react-native-android-open-settings"
import CryptoJS from 'crypto-js';
import DatePicker from "react-native-datepicker";
import moment from 'moment';

// redux
import { fetchUser, notify, registerAsACompany } from "../../redux/auth";

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
    alignItems: 'center',
    marginTop: Layout.window.height / 15,
    width: Layout.window.height / 2.5,
};

const TITLE_VIEW: ViewStyle = {
    flexDirection: "row",
    justifyContent: 'space-between',
    width: "100%"
};

const DISCOVER: TextStyle = {
    fontSize: 22,
    color: colors.blackTwo,
    fontFamily: fonts.RubikRegular,
    lineHeight: 40,
    textAlign: 'left',
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
    marginTop: Layout.window.height / 20,
    backgroundColor: colors.ravrPurple,
}

const REDEEM_BUTTON_TEXT: TextStyle = {
    fontSize: 12,
    fontFamily: fonts.RubikRegular,
    color: colors.white,
    textTransform: 'uppercase'
}

interface MyFormValues {
    location: string
    description: string
    name: string
}

interface StateProps {
    authSearchKey: string
}

const schema = Yup.object().shape({
    location: Yup.string()
        .min(6, "common.fieldTooShort")
        .required("common.fieldRequired"),
    name: Yup.string()
        .min(6, "common.fieldTooShort")
        .required("common.fieldRequired"),
    description: Yup.string()
        .min(10, "common.fieldTooShort")
        .required("common.fieldRequired"),
})

const CreateTrip = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("loading")
    const user = selectStore("user")
    const { companies } = user
    const [uploading, setUploading] = useState(false)

    const [startDate, setStartDate] = useState('')

    const startDatePicker = useRef(null)

    const [endDate, setEndDate] = useState('')

    const endDatePicker = useRef(null)

    console.log(companies)

    // PROPS
    let nameInput = useRef(null)
    let descriptionInput = useRef(null)
    let locationInput = useRef(null)


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
        if (companies.length > 0) {
            // slidingUpPanelRef.current.hide()
        }
    }, [loading])

    const submit = (values: any) => {
        const { name, location, description } = values

        navigation.navigate('Package', {
            name,
            location,
            startDate,
            endDate,
            description
        })
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            behaviour="position"
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
                                dispatch(fetchUser())
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
                                {translate(`createTrip.header`)}
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack()
                                }}
                                style={{
                                    top: 10
                                }}
                            >
                                <MaterialIcons
                                    name="cancel"
                                    color={colors.ravrPurple}
                                    size={26}
                                />
                            </TouchableOpacity>

                        </View>

                    </View>

                    <Text

                        style={DISCOVER_MORE}
                    >
                        {translate(`createTrip.tripDiscription`)}
                    </Text>

                    <Formik
                        initialValues={{
                            location: "",
                            name: ""
                        }}
                        validationSchema={schema}
                        onSubmit={(values) => submit(values)}
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
                                        marginTop: Layout.window.height / 25
                                    }}
                                >
                                    <TextField
                                        name="name"
                                        keyboardType="default"
                                        placeholderTx="createTrip.namePlaceholder"
                                        value={values.name}
                                        onChangeText={handleChange("name")}
                                        onBlur={handleBlur("name")}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                        isInvalid={!isValid}
                                        fieldError={errors.name}
                                        forwardedRef={nameInput}
                                        placeholderTextColor={colors.faddedGrey}
                                        onSubmitEditing={() => locationInput.current.focus()}
                                    />

                                    <TextField
                                        name="location"
                                        keyboardType="default"
                                        placeholderTx="createTrip.locationPlaceholder"
                                        value={values.location}
                                        onChangeText={handleChange("location")}
                                        onBlur={handleBlur("location")}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                        isInvalid={!isValid}
                                        fieldError={errors.location}
                                        forwardedRef={locationInput}
                                        placeholderTextColor={colors.faddedGrey}
                                        onSubmitEditing={() => descriptionInput.current.focus()}

                                    />

                                    <TextField
                                        name="description"
                                        keyboardType="default"
                                        placeholderTx="createTrip.locationDescription"
                                        value={values.description}
                                        onChangeText={handleChange("description")}
                                        onBlur={handleBlur("description")}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                        isInvalid={!isValid}
                                        fieldError={errors.description}
                                        forwardedRef={descriptionInput}
                                        placeholderTextColor={colors.faddedGrey}

                                    />


                                    <TextField
                                        name="startDate"
                                        placeholderTx="createTrip.selectStartDate"
                                        value={startDate}
                                        placeholderTextColor={colors.faddedGrey}
                                        onFocus={() => {
                                            startDatePicker.current.onPressDate()
                                        }}
                                    />

                                    <TextField
                                        name="startDate"
                                        placeholderTx="createTrip.selectEndDate"
                                        value={endDate}
                                        placeholderTextColor={colors.faddedGrey}
                                        onFocus={() => {
                                            endDatePicker.current.onPressDate()
                                        }}
                                    />

                                    <Button
                                        style={REDEEM_BUTTON}
                                        textStyle={REDEEM_BUTTON_TEXT}
                                        disabled={!isValid || loading || uploading || startDate.length < 1 || endDate.length < 1}
                                        onPress={() => handleSubmit()}
                                    >
                                        {
                                            loading || uploading
                                                ? <ActivityIndicator size="small" color={colors.white} />
                                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`createTrip.addPackage`)}</Text>
                                        }
                                    </Button>
                                </View>
                            </View>
                        )}
                    </Formik>

                    <DatePicker
                        style={{
                            height: 1,
                            width: 1
                        }}
                        ref={startDatePicker}
                        showIcon={false}
                        hideText={true}
                        date={startDate}
                        androidMode="spinner"
                        mode="date"
                        confirmBtnText="OK"
                        cancelBtnText="CANCEL"
                        format="DD-MM-YYYY"
                        onDateChange={date => {
                            setStartDate(date);
                        }}
                        // maxDate={moment().subtract(18, "years")}
                        minDate={new Date(Date.now())}
                    />

                    <DatePicker
                        style={{
                            height: 1,
                            width: 1
                        }}
                        ref={endDatePicker}
                        showIcon={false}
                        hideText={true}
                        date={endDate}
                        androidMode="spinner"
                        mode="date"
                        confirmBtnText="OK"
                        cancelBtnText="CANCEL"
                        format="DD-MM-YYYY"
                        onDateChange={date => {
                            setEndDate(date);
                        }}
                        minDate={new Date(Date.now())}

                    />




                </ScrollView>
            </View>


        </KeyboardAvoidingView >
    )
}

export default CreateTrip
