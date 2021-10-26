import React from "react";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from "@react-navigation/native";
import useReduxStore from "../utils/hooks/useRedux";
import MyTrips from "../screens/myTrips";
import CreateTrip from "../screens/createTrip";
import Package from "../screens/packages";
import Picture from "../screens/pictures";
import ViewTrips from "../screens/viewTrips";
import People from "../screens/people";

export type Routes = {
    MyTrips: undefined;
    CreateTrip: undefined;
    Package: undefined;
    Picture: undefined;
    ViewMyTrips: undefined;
    People: undefined;
};

export type AuthNavigationProps<T extends keyof Routes> = {
    navigation: NativeStackNavigationProp<Routes, T>;
    route: RouteProp<Routes, T>;
};

const Stack = createNativeStackNavigator<Routes>();

const MyTripsNavigator = () => {
    const [dispatch, selectStore] = useReduxStore("auth");
    const isLoggedIn = selectStore("isLoggedIn")

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >

            <Stack.Screen
                name="MyTrips"
                component={MyTrips}
            />

            <Stack.Screen
                name="CreateTrip"
                component={CreateTrip}
            />

            <Stack.Screen
                name="Package"
                component={Package}
            />

            <Stack.Screen
                name="Picture"
                component={Picture}
            />

            <Stack.Screen
                name="People"
                component={People}
            />

            <Stack.Screen
                name="ViewMyTrips"
                component={ViewTrips}
            />

        </Stack.Navigator>
    );
}

export default MyTripsNavigator;