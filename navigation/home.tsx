import React from "react";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from "@react-navigation/native";
import LandingPage from "../screens/landing";
import ViewTrips from "../screens/viewTrips";
import Trips from "../screens/trips";
import AllTrips from "../screens/allTrips";

export type Routes = {
    LandingPage: undefined;
    ViewTrips: undefined;
    Trips: undefined;
    AllTrips: undefined
};

export type AuthNavigationProps<T extends keyof Routes> = {
    navigation: NativeStackNavigationProp<Routes, T>;
    route: RouteProp<Routes, T>;
};

const Stack = createNativeStackNavigator<Routes>();

const HomeNavigator = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen
            name="LandingPage"
            component={LandingPage}
        />

        <Stack.Screen
            name="ViewTrips"
            component={ViewTrips}
        />

        <Stack.Screen
            name="Trips"
            component={Trips}
        />

        <Stack.Screen
            name="AllTrips"
            component={AllTrips}
        />

    </Stack.Navigator>
);

export default HomeNavigator;
