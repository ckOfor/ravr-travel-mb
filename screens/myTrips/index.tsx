// react
import React, { useEffect, useState, useRef } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ScrollView, RefreshControl,
    TouchableOpacity, ActivityIndicator, Keyboard, Linking, FlatList, ImageBackground, Image, Pressable
} from "react-native";

// third-party
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from 'react-native-vector-icons';
import SlidingUpPanel from "rn-sliding-up-panel";
import RNPickerSelect from "react-native-picker-select";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {
    CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_URL
} from "@env"
import { appDetailsSettings } from "react-native-android-open-settings"
import CryptoJS from 'crypto-js';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// redux
import { fetchUser, notify, registerAsACompany } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts, images } from "../../theme";

// util
import { translate } from "../../i18n";
import useReduxStore from "../../utils/hooks/useRedux";
import moment from "moment";

const ROOT: ViewStyle = {
    height: Layout.window.height,
    alignItems: 'center',
    justifyContent: 'center',
    width: Layout.window.width,
    backgroundColor: colors.white
};

const SCROLL_ROOT: ViewStyle = {
    // marginBottom: Platform.OS === "ios" ? 0 : Layout.window.height / 15,
    marginHorizontal: 15,
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
    lineHeight: 40,
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
    // fontSize: 15,
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

const DISCOVER_MORE: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20,
    width: Layout.window.width / 2,
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
    rcNumber: string
}

interface StateProps {
    authSearchKey: string
}

const schema = Yup.object().shape({
    rcNumber: Yup.string()
        .min(7, "common.fieldTooShort")
        .required("common.fieldRequired"),
})

const MyTrips = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("loading")
    const user = selectStore("user")
    const { companies, trips, transactions } = user
    const [uploading, setUploading] = useState(false)
    const [sortedBy, setSortedBy] = useState('personal')
    const [allTrips, setAllTrips] = useState([])

    const isRegisteredAndVerified = companies.length > 0 && companies[0].status === "approved"
    console.log(user, "<=== user")

    // PROPS
    let rcNumberInput = useRef(null)
    let slidingUpPanelRef = useRef<SlidingUpPanel>(null);
    const allTypes = [
        {
            id: 0,
            value: "Limited_Company",
            label: "Limited Company",
        },
        {
            id: 1,
            value: "business",
            label: "Business",
        },
        {
            id: 2,
            value: "incorprated_Trustee",
            label: "Incorprated Trustee",
        },
    ];
    const [type, setType] = useState([]);
    // const [rcNumber, setRCNumber] = useState('');
    const placeholderBanks = {
        label: "Select type",
        value: "",
        color: "#565F62",
    };

    // LIFECYCLE
    useFocusEffect(
        React.useCallback(() => {
            console.log("srererer")
            setSortedBy('personal')
            console.log("sortedByds")
            dispatch(fetchUser())
            setAllTrips(transactions)

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

    useEffect(() => {
        // setAllTrips(transactions)
        // setSortedBy(sortedBy)
        console.log(sortedBy, "sortedBy")
        if (sortedBy === "personal") {
            setAllTrips(transactions)
        } else {
            setAllTrips(trips)
        }
    }, [user])

    const submit = (rcNumber: string) => {
        // setRCNumber(rcNumber)
        getPermissionAsync(rcNumber)
    }

    const openUrl = (url: string) => {
        Linking.openURL(url).catch(err => Promise.reject(err))
    }

    const canOpenUrl = async (url: string) => {
        const canOpen = await Linking.canOpenURL(url)
        if (canOpen) {
            return true
        } else {
            alert("could not open url")
            return false
        }
    }

    const getImage = async (rcNumber: string) => {
        console.log('called getImage')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [4, 3],
        });

        if (!result.cancelled) {
            uploadImage(result.uri, rcNumber)
        }
    };

    const getPermissionAsync = async (rcNumber: string) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            dispatch(notify('Sorry, we need camera roll permissions to make this work!', 'danger'))
            //   setTimeout(() => openSettings() , 3000);
            if (Platform.OS === "ios") {
                const iosUrl = "app-settings:"
                const canOpen = await canOpenUrl(iosUrl)
                if (canOpen) {
                    openUrl(iosUrl)
                }
            } else {
                appDetailsSettings()
            }
        } else {
            getImage(rcNumber)
        }
    }

    const uploadImage = (uri: any, rcNumber: string) => {
        console.log(uri, "<=== uploadImage")
        setUploading(true)
        let timestamp = (Date.now() / 1000 | 0).toString();
        let api_key = CLOUDINARY_API_KEY
        let api_secret = CLOUDINARY_API_SECRET
        let hash_string = 'timestamp=' + timestamp + api_secret
        let signature = CryptoJS.SHA1(hash_string).toString();
        let upload_url = CLOUDINARY_UPLOAD_URL

        let xhr = new XMLHttpRequest();
        xhr.open('POST', upload_url);
        xhr.onload = () => {
            setUploading(false)
            console.log("xhr");
            console.log(xhr);
            if (xhr.status === 200) {
                console.log(JSON.parse(xhr.response).secure_url, "secure_url")
                const payload = {
                    type,
                    rcNumber,
                    cac: JSON.parse(xhr.response).secure_url
                }

                console.log(payload)
                dispatch(registerAsACompany(payload))
                return
            }

            dispatch(notify('Sorry, upload failed!', 'danger'))
        };
        let formdata = new FormData();
        formdata.append('file', { uri: uri, type: 'image/png', name: 'upload.png' });
        formdata.append('timestamp', timestamp);
        formdata.append('api_key', api_key);
        formdata.append('signature', signature);
        xhr.send(formdata);
    }

    const onShare = async (item: any) => {
        // const { poster, location, name, startDate, endDate } = item

        // try {
        //     const result = await Share.share({
        //         message: `${name} at ${location}: ${startDate} - ${endDate}`,
        //         url: poster,
        //         title: name
        //     });
        //     if (result.action === Share.sharedAction) {
        //         if (result.activityType) {
        //             // shared with activity type of result.activityType
        //         } else {
        //             // shared
        //         }
        //     } else if (result.action === Share.dismissedAction) {
        //         // dismissed
        //     }
        // } catch (error) {
        //     alert(error.message);
        // }
    };

    const renderTrip = ({ item }: any, index: any) => {

        const { poster, location, name, startDate } = item

        return (
            <View

            >

                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Entypo
                        name="location-pin"
                        color={colors.ravrPurple}
                        size={26}
                    />

                    <Text

                        style={TRIP_LOCATION}
                    >
                        {location}
                    </Text>
                </View>

                <Pressable
                    onPress={() => {
                        navigation.navigate('ViewMyTrips', {
                            trip: item,
                            hidePlans: true
                        })
                    }}
                >

                    <ImageBackground
                        source={{ uri: poster }}
                        style={{
                            wdith: Layout.window.width,
                            paddingVertical: 20,
                            paddingHorizontal: 20,
                            justifyContent: "space-between",
                            marginTop: 15
                        }}
                        imageStyle={{
                            borderRadius: 8
                        }}
                        contentContainerStyle={{
                            justifyContent: "space-between"
                        }}

                    >

                        <TouchableOpacity
                            onPress={() => onShare(item)}

                            style={{
                                height: 60,
                                width: 20,
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

                </Pressable>

                <View
                    style={{
                        height: 0.5,
                        width: '100%',
                        backgroundColor: '#D5D5D5',
                        marginBottom: 35
                    }}
                />

            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            behavior={"padding"}
            keyboardVerticalOffset={100}
            style={{
                backgroundColor: 'white'
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
                    style={{
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
                                {translate(`myTrips.header`)}
                            </Text>
                        </View>
                    </View>
                </View>


                {
                    companies.length < 1 && <TouchableOpacity
                        onPress={() => slidingUpPanelRef.current.show()}
                        style={{
                            backgroundColor: colors.transparent
                        }}
                    >
                        <Ionicons
                            name="ios-add-circle"
                            color={colors.ravrPurple}
                            size={26}
                        />

                    </TouchableOpacity>
                }

                {
                    isRegisteredAndVerified && <TouchableOpacity
                        onPress={() => navigation.navigate('CreateTrip')}
                        style={{
                            backgroundColor: colors.transparent
                        }}
                    >
                        <Ionicons
                            name="ios-add-circle"
                            color={colors.ravrPurple}
                            size={26}
                        />

                    </TouchableOpacity>
                }
            </View>

            <View
                style={{
                    marginHorizontal: 20
                }}
            >
                {
                    isRegisteredAndVerified && (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                marginBottom: 10

                            }}

                            onPress={() => {
                                if (sortedBy === "personal") {
                                    setSortedBy("business")
                                    dispatch(fetchUser())
                                    setAllTrips(trips)
                                } else {
                                    setSortedBy("personal")
                                    dispatch(fetchUser())
                                    setAllTrips(transactions)
                                }
                            }}
                        >
                            {/* <Text

                                    style={DISCOVER_MORE}
                                >
                                    {translate(`myTrips.headerBody`)}
                                </Text> */}

                            <View
                                style={{
                                    flexDirection: 'row',
                                    left: 10
                                }}
                            >

                                <FontAwesome5
                                    name="sort"
                                    color={colors.ravrPurple}
                                    size={26}
                                    style={{
                                        top: 6,
                                        right: 10
                                    }}
                                />
                                <Text

                                    style={[DISCOVER_MORE, {

                                    }]}
                                >
                                    {sortedBy === "personal" ? translate(`myTrips.sortBusiness`) : translate(`myTrips.sortPersonal`)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }

                <View style={{ height: Layout.window.height }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={allTrips}
                        renderItem={renderTrip}
                        style={{
                            // marginBottom: Layout.window.height / 20
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
                            marginTop: 30,
                            justifyContent: "space-between",
                            paddingBottom: Layout.window.height / 4
                        }}
                    />
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
                                {translate(`myTrips.joinRavr`)}
                            </Text>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`myTrips.joinAsCompany`)}
                            </Text>
                        </View>
                    </View>

                    <Formik
                        initialValues={{
                            rcNumber: "",
                            phoneNumber: ""
                        }}
                        validationSchema={schema}
                        onSubmit={({ rcNumber }) => submit(rcNumber)}
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
                                        name="rcNumber"
                                        keyboardType="number-pad"
                                        placeholderTx="myTrips.enterRC"
                                        value={values.rcNumber}
                                        onChangeText={handleChange("rcNumber")}
                                        onBlur={handleBlur("rcNumber")}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        isInvalid={!isValid}
                                        fieldError={errors.rcNumber}
                                        forwardedRef={i => {
                                            rcNumberInput = i
                                        }}
                                        maxLength={7}
                                        placeholderTextColor={colors.faddedGrey}
                                    />

                                    <RNPickerSelect
                                        items={allTypes}
                                        onValueChange={value => {
                                            if (allTypes.filter(e => e.value === value).length > 0) {
                                                setType(value)
                                            }
                                        }}
                                        value={type}
                                        useNativeAndroidPickerStyle={false}
                                        textInputProps={{
                                            // color: colors.companyDarkGreen,
                                            // fontFamily: fonts.gilroyLight,
                                        }}
                                        // disabled={amount.length < 2 || amount.join("") < 2}
                                        placeholder={placeholderBanks}
                                        placeholderTextColor={colors.faddedGrey}
                                    >

                                        <TextField
                                            name="amount"
                                            keyboardType="number-pad"
                                            placeholderTx="myTrips.selectCompanyType"
                                            value={type.toString().charAt(0).toUpperCase() + type.slice(1).toString().replace("_", " ")}
                                            // onSubmitEditing={() => handleSubmit()}
                                            maxLength={10}
                                            minLength={10}
                                            // editable={false}
                                            onFocus={() => {
                                                Keyboard.dismiss()
                                                console.log("pressed")
                                            }}
                                            style={{
                                                // marginTop: 20
                                            }}
                                            placeholderTextColor={colors.faddedGrey}

                                        />

                                    </RNPickerSelect>

                                    <Button
                                        style={REDEEM_BUTTON}
                                        textStyle={REDEEM_BUTTON_TEXT}
                                        disabled={!isValid || loading || type.length < 1}
                                        onPress={() => handleSubmit()}
                                    >
                                        {
                                            loading || uploading
                                                ? <ActivityIndicator size="small" color={colors.white} />
                                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`myTrips.joinRavrButton`)}</Text>
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

export default MyTrips
