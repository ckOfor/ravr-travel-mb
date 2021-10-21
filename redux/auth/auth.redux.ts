import { SET_COUPONS, SOCIAL_AUTHENTICATION, SOCIAL_AUTHENTICATION_FAILURE, SOCIAL_AUTHENTICATION_SUCCESS, TOGGLE_BIOMETRICS } from "."
import {
	AuthAction,
	AuthState,
	SET_FCM_TOKEN,
	SIGN_IN_USER,
	SIGN_IN_USER_FAILURE,
	SIGN_IN_USER_SUCCESS,
	SET_USER_DETAILS,
	IS_LOGGED_IN,
} from "./auth.types"

const IUser = {

}

const initialState: AuthState = {
	notificationId: "",
	loading: false,
	isLoggedIn: false,
	user: IUser,
	coupons: []
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

		default:
			return state
	}
}