// react
import React, { useState, useEffect } from 'react';

// third-party
import { BackHandler, ViewStyle, ImageBackground, StatusBar } from 'react-native';

// third-party
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { useFlipper } from '@react-navigation/devtools';
import { Asset } from 'react-native-unimodules';
import firebase from 'react-native-firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";

// redux
import configureStore from "./redux/create-store"
import RootNavigator from './navigation/tab';

// style
import { colors, images } from './theme';
import * as Font from "expo-font"

// layouts
import { Layout } from './constants';


export const { store, persistor } = configureStore();

const ROOT: ViewStyle = {
  height: '100%',
  width: Layout.window.width,
  backgroundColor: '#000',
};

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)

  useFlipper(navigationRef);

  useEffect(() => {
    checkPermission()
    createNotificationListeners()
  }, [])

  const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getToken();
    } else {
      requestPermission();
    }
  }

  const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();

      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log(fcmToken, "<=== fcmToken")

      }
    }

    console.log(fcmToken, "<=== fcmToken2")
  }

  const requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  const createNotificationListeners = async () => {

    /*
      * Triggered when a particular notification has been received in foreground
      * */
    const notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    const notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      showAlert(title, body);
    }

    /*
    * Triggered for data only payload in foreground
    * */
    const messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  const showAlert = (title: string, body: string | undefined) => {
    // Alert.alert(
    //   title, body,
    //   [
    //     { text: 'OK', onPress: () => console.log('OK Pressed') },
    //   ],
    //   { cancelable: false },
    // );
  }

  const backAction = () => {
    // store.dispatch(NavigationActions.back())
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  useEffect(() => {
    loadResourcesAsync()
  }, [])

  const loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([

      ]),
      Font.loadAsync({
        "Rubik-Black": require("./assets/fonts/Rubik-Black.ttf"),
        "Rubik-BlackItalic": require("./assets/fonts/Rubik-BlackItalic.ttf"),
        "Rubik-Bold": require("./assets/fonts/Rubik-Bold.ttf"),
        "Rubik-BoldItalic": require("./assets/fonts/Rubik-BoldItalic.ttf"),
        "Rubik-Light": require("./assets/fonts/Rubik-Light.ttf"),
        "Rubik-LightItalic": require("./assets/fonts/Rubik-LightItalic.ttf"),
        "Rubik-Medium": require("./assets/fonts/Rubik-Medium.ttf"),
        "Rubik-MediumItalic": require("./assets/fonts/Rubik-MediumItalic.ttf"),
        "Rubik-Regular": require("./assets/fonts/Rubik-Regular.ttf"),
        "Rubik-RegularItalic": require("./assets/fonts/Rubik-RegularItalic.ttf"),
      }),
    ]);

    setIsLoadingComplete(true)
  };

  if (!isLoadingComplete) return null;

  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
      >
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}
