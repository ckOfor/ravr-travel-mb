export const SET_FCM_TOKEN = "SET_FCM_TOKEN"
export const TOGGLE_BIOMETRICS = "TOGGLE_BIOMETRICS"

type SetFCMTokenAction = {
	type: typeof SET_FCM_TOKEN
	payload: string
}

type toggleBiometric = {
	type: typeof TOGGLE_BIOMETRICS
}

export const SAVE_PIN = "SAVE_PIN"
type SavePin = {
	type: typeof SAVE_PIN
	payload: string
}

export const SIGN_IN_USER = "SIGN_IN_USER"
type SignInUser = {
	type: typeof SIGN_IN_USER
}

export const SIGN_IN_USER_FAILURE = "SIGN_IN_USER_FAILURE"
type SignInUserFailure = {
	type: typeof SIGN_IN_USER_FAILURE
}

export const SIGN_IN_USER_SUCCESS = "SIGN_IN_USER_SUCCESS"
type SignInUserSuccess = {
	type: typeof SIGN_IN_USER_SUCCESS
}

export const SET_USER_DETAILS = "SET_USER_DETAILS"
type setUserDetails = {
	type: typeof SET_USER_DETAILS
	payload: IUser
}

export const SET_SEARCH_RESULTS = "SET_SEARCH_RESULTS"
type setSearchResult = {
	type: typeof SET_SEARCH_RESULTS
	payload: Array<any>
}

export const SET_POPULAR_TRIPS = "SET_POPULAR_TRIPS"
type setPopularTrips = {
	type: typeof SET_POPULAR_TRIPS
	payload: any
}

export const SET_TRENDING_TRIPS = "SET_TRENDING_TRIPS"
type setTrendingTrips = {
	type: typeof SET_TRENDING_TRIPS
	payload: any
}

export const SET_LOCAL_TRIPS = "SET_LOCAL_TRIPS"
type setLocalTrips = {
	type: typeof SET_LOCAL_TRIPS
	payload: any
}

export const SET_COUPONS = "SET_COUPONS"
type SetCoupons = {
	type: typeof SET_COUPONS
	payload: IUser
}

export const SOCIAL_AUTHENTICATION = "SOCIAL_AUTHENTICATION"
type SocialAuthenticationAction = {
	type: typeof SOCIAL_AUTHENTICATION
	payload: string
}

export const SET_USER = "SET_USER"

export const SOCIAL_AUTHENTICATION_SUCCESS = "SOCIAL_AUTHENTICATION_SUCCESS"
type SocialAuthenticationActionSuccess = {
	type: typeof SOCIAL_AUTHENTICATION_SUCCESS
	payload: string
}

export const SOCIAL_AUTHENTICATION_FAILURE = "SOCIAL_AUTHENTICATION_FAILURE"
type SocialAuthenticationActionFailure = {
	type: typeof SOCIAL_AUTHENTICATION_FAILURE
	payload: string
}

export const FACEBOOK_AUTH = "FACEBOOK_AUTH"
type FacebookAuthAction = {
	type: typeof FACEBOOK_AUTH
	payload: string
}

export const SET_TOKEN = "SET_TOKEN"
type SetTokenAction = {
	type: typeof SET_TOKEN
	payload: string
}

export const CLEAR_TOKEN = "CLEAR_TOKEN"
type ClearTokenAction = {
	type: typeof CLEAR_TOKEN
}

export const SET_USER_EXISTS = "SET_USER_EXISTS"
type SetUserExistsAction = {
	type: typeof SET_USER_EXISTS
	payload: boolean
}

export const SET_AUTH_FIRST_NAME = "SET_AUTH_FIRST_NAME"
type SetAuthFirstNameAction = {
	type: typeof SET_AUTH_FIRST_NAME
	payload: string
}

export const SET_AUTH_FULL_NAME = "SET_AUTH_FULL_NAME"
type SetAuthFullNameAction = {
	type: typeof SET_AUTH_FULL_NAME
	payload: string
}

export const SET_AUTH_LAST_NAME = "SET_AUTH_LAST_NAME"
type SetAuthLastNameAction = {
	type: typeof SET_AUTH_LAST_NAME
	payload: string
}

export const SET_AUTH_EMAIL = "SET_AUTH_EMAIL"
type SetAuthEmailAction = {
	type: typeof SET_AUTH_EMAIL
	payload: string
}

export const SET_AUTH_PASSWORD = "SET_AUTH_PASSWORD"
type SetAuthPasswordAction = {
	type: typeof SET_AUTH_PASSWORD
	payload: string
}

export const SET_AUTH_TYPE = "SET_AUTH_TYPE"
type SetAuthTypeAction = {
	type: typeof SET_AUTH_TYPE
	payload: string
}

export const SET_AUTH_UID = "SET_AUTH_UID"
type SetAuthUIDAction = {
	type: typeof SET_AUTH_UID
	payload: string
}


export const SET_AUTH_PICTURE = "SET_AUTH_PICTURE"
type SetAuthPictureAction = {
	type: typeof SET_AUTH_PICTURE
	payload: string
}

export const SET_AUTH_PHONE = "SET_AUTH_PHONE"
type SetAuthPhoneAction = {
	type: typeof SET_AUTH_PHONE
	payload: string
}

export const IS_LOGGED_IN = "IS_LOGGED_IN"
type ToggleOnline = {
	type: typeof IS_LOGGED_IN
	payload: string
}

export const SET_TRANSACTIONS = "SET_TRANSACTIONS"
type SetTransactions = {
	type: typeof SET_TRANSACTIONS
	payload: Array<any>
}

export const SET_BALANCE = "SET_BALANCE"
type SetBalance = {
	type: typeof SET_BALANCE
	payload: any
}


export type IWallet = {

}

export type IUser = {
	"authType": string
	"birthDate": string
	"coupons": Array<any>
	"createdAt": string
	"email": string
	"fullName": string
	"gender": string
	"hasPassword": boolean
	"id": number
	"notificationID": string
	"password": string
	"phoneNumber": string
	"pictureURL": string
	"pin": string
	"ravrId": string
	"status": string
	"suspensionReason": string
	"travelName": string
	"updatedAt": string
	"wallets": Array<any>
	"transactionPin": string
}

export type ICreateWallet = {

}

export type AuthState = {
	notificationId: string
	isLoggedIn: boolean
	user: IUser
	loading: boolean
	coupons: Array<any>
	transactions: Array<any>
	balance: any
	popular: Array<any>
	trending: Array<any>
	local: Array<any>
	searchResults: Array<any>
}

export type authCredentials = {
	code: string
	code_challenge: string
}

export type AuthAction =
	| SetFCMTokenAction
	| SignInUser
	| SignInUserFailure
	| SignInUserSuccess
	| setUserDetails
	| toggleBiometric
	| SavePin
	| SocialAuthenticationAction
	| SocialAuthenticationActionFailure
	| SocialAuthenticationActionSuccess
	| ToggleOnline
	| SetCoupons
	| SetTransactions
	| SetBalance
	| setPopularTrips
	| setTrendingTrips
	| setLocalTrips
	| setSearchResult
