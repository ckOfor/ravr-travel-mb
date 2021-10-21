import React from "react";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from "@react-navigation/native";
import LandingPage from "../screens/landing";

export type Routes = {
    LandingPage: undefined;
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

    </Stack.Navigator>
);

export default HomeNavigator;
