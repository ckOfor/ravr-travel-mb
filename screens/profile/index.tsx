// react
import React, { useEffect, useRef, useState } from "react";

// react-native
import {
    KeyboardAvoidingView, TextStyle, Text, View, ViewStyle, StatusBar, Platform, ScrollView, Image, ImageStyle, TouchableOpacity, ImageBackground, ActivityIndicator, Linking
} from "react-native";

// third-party
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { useFocusEffect } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {
    CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_URL
} from "@env"
import { appDetailsSettings } from "react-native-android-open-settings"
import CryptoJS from 'crypto-js';

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
import { editProfile, notify, redeemCoupon } from "../../redux/auth";

const ROOT: ViewStyle = {
    height: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    // width: Layout.window.width,
    // backgroundColor: colors.white
};


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

const BACKGROUND_IMAGE: ImageStyle = {
    height: Layout.window.height > 700 ? Layout.window.height / 2.5 : Layout.window.height / 2,
    // width: Layout.window.width,
    // flex: 1,
    // position: 'absolute',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
}

const PROFILE_IMAGE: ImageStyle = {
    height: 120,
    width: 120,
    borderRadius: 60
}

const DETAILS: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.window.height / 7
}


const SHADOW: ViewStyle = {
    height: 251,
    width: 299,
    backgroundColor: colors.white,
    borderRadius: 8,
    //ios
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: {
        height: 1,
        width: 1
    },
    //android
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
}

const SUBSCRIPTION: ViewStyle = {
    backgroundColor: colors.white,
    height: Layout.window.height / 3.1,
    width: Layout.window.width / 2,
    marginLeft: 20,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 8,

    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
        height: 1,
        width: 1
    },

    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
}

const HEADER_TEXT: TextStyle = {
    fontSize: 22,
    color: colors.white,
    fontFamily: fonts.RubikRegular,
    lineHeight: 40,
    textAlign: 'center',
    marginTop: 20
}

const PLAN_TEXT: TextStyle = {
    ...HEADER_TEXT,
    fontSize: 13,
}

const LABEL_TEXT: TextStyle = {
    marginLeft: 25,
    color: colors.black,
    fontFamily: fonts.RubikRegular,
    lineHeight: 40,
    textAlign: 'center',
    width: Layout.window.width / 1.9,
}

const LOCATION: TextStyle = {
    color: colors.white,
    fontFamily: fonts.RubikRegular,
    textAlign: 'center',
    width: Layout.window.width / 1.5,
}

const JOIN_BUTTON: ViewStyle = {
    borderRadius: 100,
    width: Layout.window.width / 2,
    marginTop: 10,
    marginBottom: Layout.window.height / 10,
    backgroundColor: colors.ravrPurple,
}

const JOIN_BUTTON_TEXT: TextStyle = {
    fontSize: 12,
    fontFamily: fonts.RubikRegular,
    color: colors.white,
    textTransform: 'uppercase'
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

const VERSION: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    lineHeight: 20,
    // alignSelf: 'flex-start',
    // width: Layout.window.width / 1.5,
    marginTop: 20,
}

const TRIP_IMAGE: ImageStyle = {
    alignSelf: "flex-end",
    height: 233,
    width: Layout.window.width / 2.4,
    borderRadius: 12,
}

const infoTextStyle: TextStyle = {
    color: colors.blue1,
    fontFamily: fonts.RubikRegular,
    marginTop: 10,
}

const moreTextStyle: TextStyle = {
    color: colors.white,
    fontFamily: fonts.RubikRegular,
    textAlign: 'center',
    width: Layout.window.width / 3,
    textTransform: 'uppercase'
}

interface MyFormValues {
    reference: string
}

const schema = Yup.object().shape({
    reference: Yup.string()
        .min(6, "common.fieldTooShort")
        .required("common.fieldRequired"),
})

interface StateProps {
    authSearchKey: string
}

const Profile = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("loading")
    const user = selectStore("user")
    const { pictureURL, fullName, email } = user

    // PROPS
    let referenceInput = useRef(null)
    const [uploading, setUploading] = useState(false)
    // LIFECYCLE
    useEffect(() => {

    }, [])

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle("light-content")

            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor(colors.ravrPurple)
            }

        }, [])
    );

    const getImage = async () => {
        console.log('called getImage')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            // aspect: [4, 3],
        });

        if (!result.cancelled) {
            uploadImage(result.uri)
        }
    };

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

    const getPermissionAsync = async () => {
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
            getImage()
        }
    }

    const uploadImage = (uri: any) => {
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
                dispatch(editProfile(undefined, undefined, JSON.parse(xhr.response).secure_url))
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


    const submit = ({ reference }) => {
        console.log(reference)
        dispatch(redeemCoupon(reference))
    }

    return (
        <KeyboardAvoidingView
            enabled={true}
            behavior={"padding"}
            // keyboardVerticalOffset={100}
            style={{
                backgroundColor: colors.white
            }}
        >
            <View
                style={ROOT}
            >
                <ScrollView
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    pinchGestureEnabled
                    contentContainerStyle={{
                        justifyContent: "space-between",
                    }}
                    style={BACKGROUND_IMAGE}
                    bounces={false}
                >

                    <ImageBackground
                        source={images.bkImage}
                        style={BACKGROUND_IMAGE}
                        resizeMethod={'auto'}
                        resizeMode='cover'
                    >

                        <TouchableOpacity
                            // disabled={isUploading || isLoading}
                            style={{
                                width: Layout.window.width / 1.1,
                                alignItems: "flex-end",
                                marginTop: Layout.window.width / 7
                            }}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <Image
                                source={images.editIcon}
                                style={{
                                    height: 20,
                                    width: 20,
                                }}
                                resizeMethod={'auto'}
                                resizeMode='cover'
                            />
                        </TouchableOpacity>

                        <View
                            style={{
                                alignItems: 'center',
                                marginTop: Layout.window.height / 20
                            }}
                        >
                            {
                                pictureURL !== ""
                                    ? (
                                        <TouchableOpacity
                                            onPress={getPermissionAsync}
                                            disabled={loading}
                                        >
                                            <Image
                                                source={{ uri: `${pictureURL}` }}
                                                style={PROFILE_IMAGE}
                                                resizeMethod={'auto'}
                                                resizeMode='cover'
                                            />
                                        </TouchableOpacity>
                                    )

                                    : (
                                        <TouchableOpacity
                                            onPress={getPermissionAsync}
                                            disabled={loading}
                                        >
                                            <Image
                                                source={images.appLogo}
                                                style={PROFILE_IMAGE}
                                                resizeMethod={'auto'}
                                                resizeMode='cover'
                                            />
                                        </TouchableOpacity>
                                    )

                            }

                            <Text
                                style={HEADER_TEXT}
                                numberOfLines={1}
                            >
                                {fullName}

                            </Text>

                            <Text
                                style={[LOCATION, {
                                    marginBottom: 20
                                }]}
                            >
                                {email}

                            </Text>
                        </View>

                    </ImageBackground>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            marginTop: 25,
                            marginHorizontal: 20,
                        }}
                    >
                        <View
                        // onPress={() => navigation.navigate('Redeem')}
                        >
                            <Text

                                style={discoverTextStyle}
                            >
                                {translate(`profile.save`)}
                            </Text>

                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`profile.saveMore`)}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            marginLeft: 20,
                            marginTop: Layout.window.height / 25,
                            width: Layout.window.width / 1.1,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text

                                style={discoverTextStyle}
                            >
                                {translate(`profile.redeemHeader`)}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Redeem')}
                            style={{
                                marginTop: 15,
                            }}
                        >
                            <Text

                                style={discoverMoreTextStyle}
                            >
                                {translate(`profile.manageRedeem`)}
                            </Text>

                        </TouchableOpacity>
                    </View>

                    <Formik
                        initialValues={{
                            reference: ""
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
                                        name="reference"
                                        keyboardType="default"
                                        placeholderTx="profile.code"
                                        value={values.reference}
                                        onChangeText={handleChange("reference")}
                                        onBlur={handleBlur("reference")}
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        isInvalid={!isValid}
                                        fieldError={errors.reference}
                                        forwardedRef={i => {
                                            referenceInput = i
                                        }}
                                        onSubmitEditing={() => handleSubmit()}
                                        maxLength={6}
                                    />

                                    <Button
                                        style={REDEEM_BUTTON}
                                        textStyle={REDEEM_BUTTON_TEXT}
                                        disabled={!isValid || loading}
                                        onPress={() => handleSubmit()}
                                    >
                                        {
                                            loading || uploading
                                                ? <ActivityIndicator size="small" color={colors.white} />
                                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`profile.redeem`)}</Text>
                                        }
                                    </Button>

                                    <Text
                                        style={VERSION}
                                    >
                                        v3.0.1
                                    </Text>
                                </View>
                            </View>
                        )}
                    </Formik>


                </ScrollView>
            </View>
        </KeyboardAvoidingView >
    )
}

export default Profile
