import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import storage from "@react-native-async-storage/async-storage"
import { persistReducer, persistStore } from "redux-persist"
import Reactotron from "../config/reactotron-config"
import { middleware as navigationMiddleware } from "../navigation/redux-navigation"
import { appReducer } from "./"

const persistConfig = {
  key: "root",
  storage
}

// creates the store
export default () => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [thunk]
  const enhancers = []

  /* ------------- Navigation Middleware ------------ */
  //@ts-ignore
  // middleware.push(navigationMiddleware)

  /* ------------- Analytics Middleware ------------- */

  /* ------------- Assemble Middleware ------------- */
  enhancers.push(applyMiddleware(...middleware))
  if (__DEV__) enhancers.push(Reactotron.createEnhancer())

  /* ------------- PERSISTOR ----------------------e5--- */
  const reducerPersist = persistReducer(persistConfig, appReducer)

  const store = createStore(reducerPersist, compose(...enhancers))
  const persistor = persistStore(store)

  // kick off root saga

  return {
    store,
    persistor
  }
}
