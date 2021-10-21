import DebugConfig from "./debug-config"

if (__DEV__) {
  console.disableYellowBox = !DebugConfig.yellowBox
}
