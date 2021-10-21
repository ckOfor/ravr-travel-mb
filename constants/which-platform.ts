import { Platform } from "react-native"

export const WhichPlatform = {
  isWeb: Platform.OS === "web",
  isNative: Platform.OS === "android" || Platform.OS === "ios"
}
