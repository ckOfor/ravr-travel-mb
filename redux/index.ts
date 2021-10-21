import { combineReducers, Reducer } from "redux"
import { authReducer as auth, AuthState } from "./auth"

export interface ApplicationState {
//   nav: any
  auth: AuthState
}

export const appReducer: Reducer<ApplicationState> = combineReducers({
//   nav: navReducer,
  auth,
});
