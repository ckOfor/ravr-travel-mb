import { SET_BALANCE, SET_COUPONS, SET_LOCAL_TRIPS, SET_POPULAR_TRIPS, SET_TRANSACTIONS, SET_TRENDING_TRIPS, SOCIAL_AUTHENTICATION, SOCIAL_AUTHENTICATION_FAILURE, SOCIAL_AUTHENTICATION_SUCCESS, TOGGLE_BIOMETRICS, TOGGLE_WEBVIEW } from "."
import {
	AuthAction,
	AuthState,
	SET_FCM_TOKEN,
	SIGN_IN_USER,
	SIGN_IN_USER_FAILURE,
	SIGN_IN_USER_SUCCESS,
	SET_USER_DETAILS,
	IS_LOGGED_IN,
	SET_SEARCH_RESULTS,
	SET_WEBVIEW,
	SET_SELECTED_AMOUNT,
} from "./auth.types"

const IUser = {
	"authType": "",
	"birthDate": "",
	"coupons": [],
	"createdAt": "",
	"email": "",
	"fullName": "",
	"gender": "",
	"hasPassword": false,
	"id": 0,
	"notificationID": "",
	"password": "",
	"phoneNumber": "",
	"pictureURL": "",
	"pin": null,
	"ravrId": "",
	"status": "",
	"suspensionReason": "",
	"travelName": null,
	"updatedAt": "",
	"wallets": [],
	"transactionPin": "",
}

const initialState: AuthState = {
	notificationId: "",
	loading: false,
	isLoggedIn: false,
	user: IUser,
	coupons: [],
	transactions: [],
	balance: {},
	popular: [],
	trending: [],
	local: [],
	searchResults: [],
	showWebView: false,
	webViewURL: '',
	selectedAmount: 0
}

export function authReducer(
	state = initialState,
	action: AuthAction
): AuthState {
	switch (action.type) {

		case SET_FCM_TOKEN:
			return {
				...state,
				notificationId: action.payload
			}

		case IS_LOGGED_IN:
			return {
				...state,
				isLoggedIn: !state.isLoggedIn
			}

		case SIGN_IN_USER:
			return {
				...state,
				loading: true
			}

		case TOGGLE_BIOMETRICS:
		case SOCIAL_AUTHENTICATION:
			return {
				...state,
				loading: true
			}

		case SIGN_IN_USER_FAILURE:
		case SOCIAL_AUTHENTICATION_FAILURE:
		case SOCIAL_AUTHENTICATION_SUCCESS:
		case SIGN_IN_USER_SUCCESS:
			return {
				...state,
				loading: false,
			}

		case SET_USER_DETAILS:
			return {
				...state,
				user: action.payload,
			}

		case SET_COUPONS:
			return {
				...state,
				coupons: action.payload,
			}

		case SET_TRANSACTIONS:
			return {
				...state,
				transactions: action.payload,
			}

		case SET_BALANCE:
			return {
				...state,
				balance: action.payload,
			}

		case SET_POPULAR_TRIPS:
			return {
				...state,
				popular: action.payload,
			}

		case SET_TRENDING_TRIPS:
			return {
				...state,
				trending: action.payload,
			}

		case SET_LOCAL_TRIPS:
			return {
				...state,
				local: action.payload,
			}

		case SET_SEARCH_RESULTS:
			return {
				...state,
				searchResults: action.payload,
			}

		case TOGGLE_WEBVIEW:
			return {
				...state,
				showWebView: action.payload,
			}

		case SET_WEBVIEW:
			return {
				...state,
				webViewURL: action.payload,
			}

		case SET_SELECTED_AMOUNT:
			return {
				...state,
				selectedAmount: action.payload,
			}

		default:
			return state
	}
}