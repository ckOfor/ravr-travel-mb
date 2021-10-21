import Reactotron, { trackGlobalErrors } from "reactotron-react-native"
import { ArgType } from "reactotron-core-client"
import { reactotronRedux as reduxPlugin } from "reactotron-redux"
// import { NavigationActions } from "react-navigation"

import Config from "./debug-config"
import { clear } from "../lib/storage"
import { store } from "../App"

/** Do Nothing. */
const noop = () => undefined

if (__DEV__) {
  //@ts-ignore
  console.tron = Reactotron
} else {
  // attach a mock so if things sneaky by our __DEV__ guards, we won't crash.
  //@ts-ignore
  console.tron = {
    benchmark: noop,
    clear: noop,
    close: noop,
    configure: noop,
    connect: noop,
    display: noop,
    error: noop,
    image: noop,
    log: noop,
    logImportant: noop,
    overlay: noop,
    reportError: noop,
    use: noop,
    useReactNative: noop,
    warn: noop,
    createStore: noop
  }
}

if (Config.useReactotron) {
  // @ts-ignore
  Reactotron.configure({ name: "Cydene Express" })
    .useReactNative()
    .use(reduxPlugin())
    // @ts-ignore
    .use(trackGlobalErrors())
    .connect()

  Reactotron.onCustomCommand({
    command: "Clear Storage",
    handler: () => {
      Reactotron.display("CLEARING STORAGE")
      clear()
    },
    title: "Clear Storage",
    description: "Clear the storage"
  })

  Reactotron.onCustomCommand({
    command: "goBack",
    handler: () => {
      // store.dispatch(NavigationActions.back())
    },
    title: "Go Back",
    description: "Go back the stack."
  })

  Reactotron.onCustomCommand({
    command: "navigateTo",
    handler: args => {
      const { route } = args
      if (route) {
        //@ts-ignore
        console.tron.log(`Navigating to: ${route}`)
        // store.dispatch(NavigationActions.navigate({ routeName: route }))
      } else {
        //@ts-ignore
        console.tron.log("Could not navigate. No route provided.")
      }
    },
    title: "Navigate To Screen",
    description: "Navigates to a screen by name.",
    args: [
      {
        name: "route",
        type: ArgType.String
      }
    ]
  })

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear()
}

export default Reactotron
