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
    marginTop: Layout.window.height / 30,
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

const Package = ({ navigation, route, authSearchKey }) => {

    // REDUX
    const [dispatch, selectStore] = useReduxStore("auth");
    const loading = selectStore("loading")
    const user = selectStore("user")
    const { companies } = user

    const isRegisteredAndVerified = companies.length > 0 && companies[0].status === "approved"

    // PROPS
    const [uploading, setUploading] = useState(false)

    const [priceTextValue, setPriceTextValue] = useState('');
    const [priceNumInputs, setPriceNumInputs] = useState(1);
    const refPriceInputs = useRef<string[]>([priceTextValue]);

    const [nameTextValue, setNameTextValue] = useState('');
    const [nameNumInputs, setNameNumInputs] = useState(1);
    const refNameInputs = useRef<string[]>([nameTextValue]);

    const [descriptionTextValue, setDescriptionTextValue] = useState('');
    const [descriptionNumInputs, setDescriptionNumInputs] = useState(1);
    const refDescriptionInputs = useRef<string[]>([descriptionTextValue]);

    const [packages, setPackages] = useState([]);
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

    const submit = () => {
        console.log(packages)
        // setRCNumber(location)
        // getPermissionAsync(rcNumber)

        console.log(nameTextValue, "nameTextValue")
        console.log(priceTextValue, "priceTextValue")
        console.log(descriptionTextValue, "descriptionTextValue")

        if (nameTextValue.length < 3) {
            dispatch(notify(`${translate('common.fieldErrorPackage', {
                fieldName: 'Package name',
                number: packages.length + 1
            })}`, `${translate('common.errorTitle')}`))
        } else if (priceTextValue.length < 3) {
            dispatch(notify(`${translate('common.fieldError', {
                fieldName: 'Amount'
            })}`, `${translate('common.errorTitle')}`))
        } else if (descriptionTextValue.length < 3) {
            dispatch(notify(`${translate('common.fieldError', {
                fieldName: 'Description'
            })}`, `${translate('common.errorTitle')}`))
        } else {
            const tempPackages = packages
            let tempObject = {
                name: nameTextValue,
                price: priceTextValue,
                description: descriptionTextValue
            }
            tempPackages.push(tempObject)
            var unique = _.uniqWith(tempPackages, _.isEqual);//removed complete duplicates
            setPackages(unique)

            const payload = {
                packages: unique,
                ...route.params
            }

            console.log(payload, "payload")
            navigation.navigate('Picture', {
                ...payload
            })
            // dispatch(createTrip({
            //     ...payload,
            //     poster: JSON.parse(xhr.response).secure_url
            // }))
            // getPermissionAsync(payload)
            // dispatch(createTrip({
            //     ...payload,
            //     poster: 'https://res.cloudinary.com/symple-innovations-company/image/upload/v1635034278/i5uiagvtitkuhiyuan7e.png'
            // }))
        }
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
                dispatch(createTrip({
                    ...payload,
                    poster: JSON.parse(xhr.response).secure_url
                }))
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



    const inputs = [];

    for (let i = 0; i < priceNumInputs; i++) {

        inputs.push(
            <View>

                <TextField
                    name="name"
                    placeholderTx="createTrip.nameOfPackage"
                    value={refNameInputs.current[i]}
                    placeholderTextColor={colors.faddedGrey}
                    onChangeText={(value) => setNameInputValue(i, value)}
                // onSubmitEditing={() => refPriceInputs.current[i].current.focus()}
                />
                <TextField
                    name="amount"
                    placeholderTx="createTrip.packagePrice"
                    value={refPriceInputs.current[i]}
                    placeholderTextColor={colors.faddedGrey}
                    onChangeText={(value) => setPriceInputValue(i, value)}
                    keyboardType="number-pad"
                    returnKeyType="done"

                />

                <TextField
                    name="description"
                    placeholderTx="createTrip.description"
                    value={refDescriptionInputs.current[i]}
                    placeholderTextColor={colors.faddedGrey}
                    onChangeText={(value) => setDescriptionInputValue(i, value)}
                    extraComponent={
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    addToPackage(i)
                                }}

                            >
                                <View
                                    style={{
                                        top: 15,
                                        flexDirection: 'row'
                                    }}
                                >
                                    <MaterialIcons
                                        name={"add"}
                                        color={colors.ravrPurple}
                                        size={24}
                                    />

                                    <Text

                                        style={{
                                            color: colors.blue1,
                                            fontFamily: fonts.RubikRegular,
                                            lineHeight: 20,
                                            width: Layout.window.width / 1.2,
                                            top: 2,
                                            left: 2
                                        }}
                                    >
                                        {translate(`createTrip.createPackage`)}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {
                                priceNumInputs > 1 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            deleteFromPackage(i)

                                            if (packages.length === 1) {

                                            }
                                        }}
                                        style={{
                                            flexDirection: 'row',
                                            left: Layout.window.width / 2,
                                            bottom: 10,

                                        }}
                                    >
                                        <MaterialIcons
                                            name={"cancel"}
                                            color={colors.ravrPurple}
                                            size={24}
                                        />

                                        <Text

                                            style={{
                                                color: colors.blue1,
                                                fontFamily: fonts.RubikRegular,
                                                lineHeight: 20,
                                                width: Layout.window.width / 1.2,
                                                top: 2,
                                                left: 2
                                            }}
                                        >
                                            {translate(`createTrip.deletePackage`)}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                    }

                />
            </View>
        )
    }

    const resetForm = () => {
        setPriceTextValue('')
        setNameTextValue('')
        setDescriptionTextValue('')
    }

    const addInput = () => {
        refPriceInputs.current.push('');
        setPriceNumInputs(value => value + 1)
    }

    const setPriceInputValue = (index: number, value: string) => {
        const inputs = refPriceInputs.current
        inputs[index] = value;
        setPriceTextValue(value)
    }

    const removePriceInputValue = (i: number) => {
        refPriceInputs.current.splice(i, 1)[0]
        setPriceNumInputs(value => value - 1)
    }

    const setNameInputValue = (index: number, value: string) => {
        const inputs = refNameInputs.current
        inputs[index] = value;
        setNameTextValue(value)
    }

    const removeNameInputValue = (i: number) => {
        refNameInputs.current.splice(i, 1)[0]
        setNameNumInputs(value => value - 1)
    }

    const setDescriptionInputValue = (index: number, value: string) => {
        const inputs = refDescriptionInputs.current
        inputs[index] = value;
        setDescriptionTextValue(value)
    }

    const removeDescriptionInputValue = (i: number) => {
        refDescriptionInputs.current.splice(i, 1)[0]
        setDescriptionNumInputs(value => value - 1)
    }

    const addToPackage = (index: number) => {


        if (nameTextValue.length < 3) {
            dispatch(notify(`${translate('common.fieldErrorPackage', {
                fieldName: 'Package name',
                number: packages.length + 1
            })}`, `${translate('common.errorTitle')}`))
        } else if (priceTextValue.length < 3) {
            dispatch(notify(`${translate('common.fieldError', {
                fieldName: 'Amount'
            })}`, `${translate('common.errorTitle')}`))
        } else if (descriptionTextValue.length < 3) {
            dispatch(notify(`${translate('common.fieldError', {
                fieldName: 'Description'
            })}`, `${translate('common.errorTitle')}`))
        } else {
            const tempPackages = packages
            let tempObject = {
                name: nameTextValue,
                price: priceTextValue.replace(/\D/g, ''),
                description: descriptionTextValue
            }
            tempPackages.push(tempObject)
            setPackages(tempPackages)

            addInput()
            resetForm()
        }
    }

    const deleteFromPackage = (index: number) => {
        const tempPackages = packages
        tempPackages.splice(index, 1)
        setPackages(tempPackages)
        removePriceInputValue(index)
        removeNameInputValue(index)
        removeDescriptionInputValue(index)

        if (packages.length === 1) {
            setNameTextValue(packages[0].name)
            setPriceTextValue(packages[0].price)
            setDescriptionTextValue(packages[0].description)
        }
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
                                {translate(`createTrip.addPackage`)}
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
                        {translate(`createTrip.body`)}
                    </Text>

                    <View
                        style={{
                            marginTop: 30
                        }}
                    >
                        {inputs}
                    </View>

                    <Button
                        style={[REDEEM_BUTTON, { alignSelf: 'center' }]}
                        textStyle={REDEEM_BUTTON_TEXT}
                        disabled={loading || uploading}
                        onPress={submit}
                    >
                        {
                            loading || uploading
                                ? <ActivityIndicator size="small" color={colors.white} />
                                : <Text style={REDEEM_BUTTON_TEXT}>{translate(`createTrip.next`)}</Text>
                        }
                    </Button>

                </View>


            </ScrollView>



        </KeyboardAvoidingView >
    )
}

export default Package
