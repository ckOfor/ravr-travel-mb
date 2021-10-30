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
import { Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
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
import { createTrip, fetchUser, notify, registerAsACompany } from "../../redux/auth";

// components
import { Button } from "../../components/button";
import { TextField } from "../../components/text-field";

// styles
import { Layout } from "../../constants";
import { colors, fonts } from "../../theme";

// util
import { translate } from "../../i18n";
import useReduxStore from "../../utils/hooks/useRedux";
import _ from "lodash";

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
})

const Picture = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("loading")
    const user = selectStore("user")
    const trips = selectStore("user").trips
    const { companies } = user

    // PROPS
    const [uploading, setUploading] = useState(false)
    const [poster, setPoster] = useState('')
    const [imageOne, setImageOne] = useState('')
    const [imageTwo, setImageTwo] = useState('')
    const [imageThree, setImageThree] = useState('')

    console.log(route, "route")

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
        // navigation.navigate('MyTrips')
        console.log(trips)
    }, [trips.length])

    const submit = () => {
        console.log(route)
        const payload = {
            ...route.params,
            poster,
            imageOne,
            imageTwo,
            imageThree
        }
        console.log(payload)
        dispatch(createTrip({
            ...payload,
        }))

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

    const getImage = async (payload: any) => {
        console.log('called getImage')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [4, 3],
        });

        if (!result.cancelled) {
            console.log(result, "NAEHEHEH")
            uploadImage(result.uri, payload)
        }
    };

    const getPermissionAsync = async (payload: any) => {
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
            getImage(payload)
        }
    }

    const uploadImage = (uri: any, payload: any) => {
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

                if (payload === 1) {
                    setPoster(JSON.parse(xhr.response).secure_url)
                }

                if (payload === 2) {
                    setImageOne(JSON.parse(xhr.response).secure_url)
                }

                if (payload === 3) {
                    setImageTwo(JSON.parse(xhr.response).secure_url)
                }

                if (payload === 4) {
                    setImageThree(JSON.parse(xhr.response).secure_url)
                }

                return
            }

            dispatch(notify('Sorry, upload failed!', 'Error'))
        };
        let formdata = new FormData();
        formdata.append('file', { uri: uri, type: 'image/png', name: 'upload.png' });
        formdata.append('timestamp', timestamp);
        formdata.append('api_key', api_key);
        formdata.append('signature', signature);
        xhr.send(formdata);
    }

    const returnImageText = () => {

    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            behaviour="position"
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
                                {translate(`createTrip.addImages`)}
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
                        {translate(`createTrip.addBodyImage`)}
                    </Text>

                    <View
                        style={{
                            marginTop: 30
                        }}
                    >
                        <TextField
                            name="poster"
                            placeholderTx="pictures.poster"
                            value={poster}
                            placeholderTextColor={colors.faddedGrey}
                            returnKeyType="done"
                            onFocus={() => {
                                Keyboard.dismiss()
                                getPermissionAsync(1)
                            }}

                        />

                        <TextField
                            name="poster"
                            placeholderTx="pictures.locationImage"
                            value={imageOne}
                            placeholderTextColor={colors.faddedGrey}
                            returnKeyType="done"
                            onFocus={() => {
                                Keyboard.dismiss()
                                getPermissionAsync(2)
                            }}

                        />

                        <TextField
                            name="poster"
                            placeholderTx="pictures.locationImage"
                            value={imageTwo}
                            placeholderTextColor={colors.faddedGrey}
                            returnKeyType="done"
                            onFocus={() => {
                                Keyboard.dismiss()
                                getPermissionAsync(3)
                            }}

                        />

                        <TextField
                            name="poster"
                            placeholderTx="pictures.locationImage"
                            value={imageThree}
                            placeholderTextColor={colors.faddedGrey}
                            returnKeyType="done"
                            onFocus={() => {
                                Keyboard.dismiss()
                                getPermissionAsync(4)
                            }}

                        />
                    </View>

                    <Button
                        style={[REDEEM_BUTTON, { alignSelf: 'center' }]}
                        textStyle={REDEEM_BUTTON_TEXT}
                        disabled={loading || uploading || poster === "" || imageOne === "" || imageTwo === "" || imageThree === ""}
                        onPress={submit}
                    >
                        {
                            loading || uploading
                                ? <ActivityIndicator size="small" color={colors.white} />
                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`createTrip.uploadAndSave`)}</Text>
                        }
                    </Button>
                </View>



            </ScrollView>



        </KeyboardAvoidingView >
    )
}

export default Picture
