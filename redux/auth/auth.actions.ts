// third-parties
import { ThunkAction } from "redux-thunk"
import { Action } from "redux"
import _ from 'lodash';
import axios from 'axios'
import moment from "moment";
import Crypto from "crypto-js";
import { RAVR_BASE_URL } from "@env"
import {
	Alert
} from "react-native";
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';

import { translate } from "../../i18n";

// Redux
import { ApplicationState } from ".."
import {
	IS_LOGGED_IN,
	SAVE_PIN,
	SET_AUTH_EMAIL,
	SET_AUTH_FULL_NAME,
	SET_AUTH_PASSWORD,
	SET_AUTH_PHONE,
	SET_AUTH_PICTURE,
	SET_AUTH_TYPE,
	SET_AUTH_UID,
	SET_BALANCE,
	SET_FCM_TOKEN,
	SET_USER_DETAILS,
	SIGN_IN_USER, SIGN_IN_USER_FAILURE, SIGN_IN_USER_SUCCESS, SOCIAL_AUTHENTICATION, SOCIAL_AUTHENTICATION_FAILURE, SOCIAL_AUTHENTICATION_SUCCESS, TOGGLE_BIOMETRICS,
} from "./auth.types";

import {
	// GoogleSigninButton,
	// statusCodes,
} from '@react-native-google-signin/google-signin';

import { GoogleSignin } from '@react-native-google-signin/google-signin';


// APIs
import {
	signInUser as apiSignInUser,
	fetchCoupons as apiFetchCoupons,
	cancelCoupons as apiCancelCoupons,
	redeemCoupons as apiRedeemCoupons,
	createCoupons as apiCreateCoupons,
	editEmail as apiEditEmail,
	createWallet as apiCreateWallet,
	fetchWalletTransactions as apiFetchWalletTransactions,
	fetchWalletBalance as apiFetchWalletBalance,
	withdrawFromWallet as apiWthdrawFromWallet,
	createWalletPin as apiCreateWalletPin,
	createCompany as apiCreateCompany,
	fetchUser as apiFetchUser,
	createTrip as apiCreateTrip,
	fetchPopularTrips as apiFetchPopularTrips,
	fetchTrendingTrips as apiFetcchTrendingTrips,
	fetchLocalTrips as apiFetchLocalTrips,
	payForTrip as apiPayForTrip,
	searchForTrip as apiSeearchTrip
} from "../../services/api"
import { SET_COUPONS, SET_LOCAL_TRIPS, SET_POPULAR_TRIPS, SET_SEARCH_RESULTS, SET_TRANSACTIONS, SET_TRENDING_TRIPS } from ".";
// import { Toast } from "native-base";

export const signInUser = () => ({
	type: SIGN_IN_USER,
})

export const signInUserFailure = () => ({
	type: SIGN_IN_USER_FAILURE,
})

export const signInUserSuccess = () => ({
	type: SIGN_IN_USER_SUCCESS,
})

export const setFCMToken = (payload: string) => ({
	type: SET_FCM_TOKEN,
	payload
})

export const toggleBiometric = () => ({
	type: TOGGLE_BIOMETRICS,
})

export const savePin = (payload: string) => ({
	type: SAVE_PIN,
	payload
})

export const setUserDetails = (user: { details: any }) => ({ type: SET_USER_DETAILS, payload: user })

export const signInUserAsync = (code: string): ThunkAction<void, ApplicationState, null, Action<any>> => async (
	dispatch,
	getState
) => {

	console.log("CODE ===>", code)

	const code_challenge = RAVR_BASE_URL

	const first_name = getState().auth.user.first_name
	// ODUWMJHIYMETOWRHMY0ZZTEZLWEZYMITNJCZMWIWMDU0YTNJ

	dispatch(signInUser())

	try {
		const result = await apiSignInUser({ code, code_challenge })
		const { kind, data } = result

		console.log(result)

		if (kind === "ok") {
			dispatch(signInUserSuccess())
			dispatch(setUserDetails(data.data))
			// dispatch(NavigationActions.navigate({ routeName: 'homepage' }))
			return first_name !== data.data.first_name ? dispatch(savePin('')) : ''
		} else {
			dispatch(notify(`${data.message}`, 'danger'))
			dispatch(signInUserFailure())
		}
	} catch ({ message }) {
		dispatch(signInUserFailure())
		dispatch(notify(`${message}`, 'danger'))
	}
}

export const notify = (message: string, type: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	//   Toast.show({ text: `${message}`, type: `${type}`, position: 'top', duration: 4000, swipeDisabled: true })
	Alert.alert(
		`${type}`, message,
		[
			{ text: 'OK', onPress: () => console.log('OK Pressed') },
		],
		{ cancelable: false },
	);
};

export const navigateTo = (route: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	// dispatch(NavigationActions.navigate({ routeName: route }))
};

export const socialAuthentication = () => ({
	type: SOCIAL_AUTHENTICATION,
})

export const socialAuthenticationFailure = () => ({
	type: SOCIAL_AUTHENTICATION_FAILURE,
})

export const socialAuthenticationSuccess = () => ({
	type: SOCIAL_AUTHENTICATION_SUCCESS,
})

export const setAuthFullName = (payload: string) => ({
	type: SET_AUTH_FULL_NAME,
	payload
})

export const setAuthEmail = (payload: string) => ({
	type: SET_AUTH_EMAIL,
	payload
})

export const setAuthPassword = (payload: string) => ({
	type: SET_AUTH_PASSWORD,
	payload
})

export const setAuthUserID = (payload: string) => ({
	type: SET_AUTH_UID,
	payload
})

export const setAuthPicture = (payload: string) => ({
	type: SET_AUTH_PICTURE,
	payload
})

export const setAuthType = (payload: string) => ({
	type: SET_AUTH_TYPE,
	payload
})

export const setAuthPhone = (payload: string) => ({
	type: SET_AUTH_PHONE,
	payload
})

export const toggleLoggedIn = () => ({
	type: IS_LOGGED_IN,
})

export const googleAuthenticationSignInAsync = (): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	console.log('googleAuthenticationSignInAsync')
	// dispatch(socialAuthentication())

	try {
		await GoogleSignin.configure({ webClientId: '547133332369-kq43s986h2mfl44qhp4vucdim0crqjag.apps.googleusercontent.com' });
		dispatch(googleUserSignInAsync())
	} catch ({ message }) {
		dispatch(socialAuthenticationFailure())
		console.error(message)
		Alert.alert(
			'Error', message,
			[
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			],
			{ cancelable: false },
		);
	}
}

export const googleUserSignInAsync = (): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {

	try {
		await GoogleSignin.hasPlayServices();
		const data = await GoogleSignin.signIn();
		console.log(data)
		if (data) {
			const { user } = data
			dispatch(setAuthFullName(`${user.givenName} ${user.familyName}`))
			dispatch(setAuthEmail(user.email))
			dispatch(setAuthUserID(user.id))
			dispatch(setAuthPicture(user.photo))
			dispatch(setAuthType('google'))
			const payload = {
				fullName: `${user.givenName} ${user.familyName}`,
				email: user.email,
				password: user.id,
				pictureURL: user.photo,
				authType: 'google'
			}

			dispatch(signInSignUp(payload))
			return
		}
	} catch ({ message }) {
		dispatch(socialAuthenticationFailure())
		dispatch(notify(`${message}`, 'danger'))
		Alert.alert(
			'Error', message,
			[
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			],
			{ cancelable: false },
		);
	}
}

export const signInSignUp = (payload: any): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	let notificationId = await firebase.messaging().getToken();
	console.log({
		...payload,
		notificationId,
		password: Crypto.SHA512(payload.password).toString(),
	}, "<=== payload")

	const details = {
		...payload,
		notificationId,
		password: Crypto.SHA512(payload.password).toString(),
	}

	console.log(details, "<=== details")

	dispatch(socialAuthentication())

	try {
		const result = await apiSignInUser(details)
		const { kind, data } = result

		console.log(result, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(setUserDetails(data.data[0]))
			dispatch(toggleLoggedIn())
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(socialAuthenticationFailure())
		dispatch(notify(`${message}`, 'Error'))
	}
}

export const setCoupons = (payload) => ({ type: SET_COUPONS, payload: payload })

export const fetchMyCoupons = (): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {

	const payload = {
		userId: getState().auth.user.id
	}

	try {
		const result = await apiFetchCoupons(payload)
		const { kind, data } = result

		console.log(result, "HERE!!!")

		if (kind === "ok") {
			dispatch(setCoupons(data.data))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
		}
	} catch ({ message }) {
		dispatch(notify(`${message}`, 'Error'))
	}
}

export const cancelMyCoupons = (reference: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		ravrId: getState().auth.user.ravrId,
		reference
	}

	try {
		const result = await apiCancelCoupons(payload)
		const { kind, data } = result

		console.log(result, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(fetchMyCoupons())
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${message}`, 'Error'))
		dispatch(socialAuthenticationFailure())

	}
}

export const redeemCoupon = (reference: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		ravrId: getState().auth.user.ravrId,
		reference
	}

	console.log(payload)

	try {
		const result = await apiRedeemCoupons(payload)
		const { kind, data } = result

		console.log(result, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(fetchMyCoupons())
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${message}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}


export const createCoupon = (amount: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		email: getState().auth.user.email,
		password: getState().auth.user.password,
		amount
	}

	console.log(payload)

	try {
		const result = await apiCreateCoupons(payload)
		const { kind, data } = result

		console.log(result, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(fetchMyCoupons())
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}

export const editProfile = (fullName: string, phoneNumber?: string, pictureURL?: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		fullName: fullName || getState().auth.user.fullName,
		phoneNumber: phoneNumber || getState().auth.user.phoneNumber,
		ravrId: getState().auth.user.ravrId,
		pictureURL: pictureURL || getState().auth.user.pictureURL,
	}

	console.log(payload, "<==== editProfile")

	try {
		const result = await apiEditEmail(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(setUserDetails(data.data))
			dispatch(notify(`${data.message}`, 'success'))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}

export const createWallet = (phoneNumber: string, bvn: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		phoneNumber: phoneNumber || getState().auth.user.phoneNumber,
		bvn,
		ravrId: getState().auth.user.ravrId,
		currency: 'NGN'
	}

	console.log(payload, "<==== createWallet")

	try {
		const result = await apiCreateWallet(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(setUserDetails(data.data))
			dispatch(notify(`${data.message}`, 'success'))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}

export const setTransactions = (payload: any) => ({
	type: SET_TRANSACTIONS,
	payload
})

export const fetchTransactions = (limit): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		email: getState().auth.user.email,
		password: getState().auth.user.password,
		transactionPin: getState().auth.user.transactionPin,
		skip: 0,
		take: limit,
		dateFrom: moment().startOf('year').format('YYYY-MM-DD'),
		dateTo: moment().endOf('year').format('YYYY-MM-DD'),
		transactionType: '0',
		currency: "NGN"
	}

	console.log(payload, "<==== apiFetchWalletTransactions")

	try {
		const result = await apiFetchWalletTransactions(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(setTransactions(data.data))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}

export const saveWalletBalance = (payload: any) => ({
	type: SET_BALANCE,
	payload
})

export const fetchWalletNalance = (): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		ravrId: getState().auth.user.ravrId,
	}

	console.log(payload, "<==== fetchWalletNalance")

	try {
		const result = await apiFetchWalletBalance(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(saveWalletBalance(data.data))
			// dispatch(notify(`${data.message}`, 'success'))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}

export const withdrawFromWallet = (options: any): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		email: getState().auth.user.email,
		password: getState().auth.user.password,
		...options,
		narration: `Ravr withdrawal for ${getState().auth.user.fullName}`
	}

	console.log(options, "<==== withdrawFromWallet")

	try {
		const result = await apiWthdrawFromWallet(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			// dispatch(setTransactions(data.data))
			dispatch(notify(`${data.message}`, 'success'))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}

export const createWalletPin = (transactionPin: string): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		email: getState().auth.user.email,
		password: getState().auth.user.password,
		transactionPin
	}

	console.log(payload, "<==== withdrawFromWallet")

	try {
		const result = await apiCreateWalletPin(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(setUserDetails(data.data))
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(fetchTransactions(10))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}


export const registerAsACompany = (details): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		email: getState().auth.user.email,
		password: getState().auth.user.password,
		...details,
		type: details.type.toLowerCase()
	}

	console.log(payload, "<==== withdrawFromWallet")

	try {
		const result = await apiCreateCompany(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(setUserDetails(data.data))
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(fetchTransactions(10))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}

export const fetchUser = (): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	const payload = {
		ravrId: getState().auth.user.ravrId,
	}

	console.log(payload, "<==== fetchUser")

	try {
		const result = await apiFetchUser(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(setUserDetails(data.data[0]))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
	}
}


export const createTrip = (details: any): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		email: getState().auth.user.email,
		password: getState().auth.user.password,
		...details,
	}

	console.log(payload, "<==== createTrip")

	try {
		const result = await apiCreateTrip(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(setUserDetails(data.data[0]))
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(fetchTransactions(10))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}

export const savePopularTrips = (details: any) => ({ type: SET_POPULAR_TRIPS, payload: details })

export const fetchPopularTrips = (limit: number): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {

	const payload = {
		ravrId: getState().auth.user.ravrId,
	}

	console.log(payload, "<==== fetchPopularTrips")

	try {
		const result = await apiFetchPopularTrips(payload)
		const { kind, data } = result

		console.log(result, "fetchPopularTrips")

		if (kind === "ok") {
			dispatch(savePopularTrips(data.data))
		} else {
			dispatch(savePopularTrips([]))
			// dispatch(notify(`${data.message}`, 'Error'))
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
	}
}

export const saveTrendingTrips = (details: any) => ({ type: SET_TRENDING_TRIPS, payload: details })

export const fetchTrendingTrips = (limit: number): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {

	const payload = {
		ravrId: getState().auth.user.ravrId,
	}

	console.log(payload, "<==== fetchTrendingTrips")

	try {
		const result = await apiFetcchTrendingTrips(payload)
		const { kind, data } = result

		console.log(result, "fetchTrendingTrips!!!")

		if (kind === "ok") {
			dispatch(saveTrendingTrips(data.data))
		} else {
			dispatch(saveTrendingTrips([]))
			// dispatch(notify(`${data.message}`, 'Error'))
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
	}
}

export const saveLocalTrips = (details: any) => ({ type: SET_LOCAL_TRIPS, payload: details })

export const fetchLocalTrips = (limit: number): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {

	const payload = {
		ravrId: getState().auth.user.ravrId,
	}

	console.log(payload, "<==== fetchLocalTrips")

	try {
		const result = await apiFetchLocalTrips(payload)
		const { kind, data } = result

		console.log(result, "fetchLocalTrips!!!")

		if (kind === "ok") {
			dispatch(saveLocalTrips(data.data))
		} else {
			dispatch(saveLocalTrips([]))
			// dispatch(notify(`${data.message}`, 'Error'))
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
	}
}

export const payForTrip = (details: any): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		email: getState().auth.user.email,
		password: getState().auth.user.password,
		...details,
	}

	console.log(payload, "<==== payForTrip")

	try {
		const result = await apiPayForTrip(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(fetchUser())
			dispatch(notify(`${data.message}`, 'success'))
			dispatch(fetchTransactions(10))
			// dispatch(fetchTrendingTrips(10))
			// dispatch(fetchPopularTrips(10))
			// dispatch(fetchLocalTrips(10))
		} else {
			dispatch(notify(`${data.message}`, 'Error'))
			dispatch(socialAuthenticationFailure())
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}

export const setSearchResult = (payload: Array<any>) => ({ type: SET_SEARCH_RESULTS, payload })

export const searchForTrip = (searchKey: string, limit: number): ThunkAction<
	void,
	ApplicationState,
	null,
	Action<any>
> => async (dispatch, getState) => {
	dispatch(socialAuthentication())

	const payload = {
		searchKey,
		limit: 100
	}

	console.log(payload, "<==== apiSeearchTrip")

	try {
		const result = await apiSeearchTrip(payload)
		const { kind, data } = result

		console.log(data.data, "HERE!!!")

		if (kind === "ok") {
			dispatch(socialAuthenticationSuccess())
			dispatch(setSearchResult(data.data))
		} else {
			dispatch(socialAuthenticationFailure())
			dispatch(setSearchResult([]))
		}
	} catch ({ message }) {
		dispatch(notify(`${translate('common.error')}`, 'Error'))
		dispatch(socialAuthenticationFailure())
	}
}
