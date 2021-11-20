// react
import React from "react";

// third-party
import { createMaterialBottomTabNavigator, MaterialBottomTabScreenProps } from '@react-navigation/material-bottom-tabs';
import { RouteProp } from "@react-navigation/native";
import { FontAwesome, FontAwesome5, Fontisto, Ionicons } from 'react-native-vector-icons';

// screens
import LandingPage from "../screens/landing";

// style
import { colors } from "../theme";
import HomeNavigator from "./home";
import ProfileNavigator from "./profile";

// utils
import useReduxStore from "../utils/hooks/useRedux";
import WalletNavigator from "./wallet";
import MyTripsNavigator from "./myTrips";

export type Routes = {
    Landing: undefined;
};

export type AuthNavigationProps<T extends keyof Routes> = {
    navigation: MaterialBottomTabScreenProps<Routes, T>;
    route: RouteProp<Routes, T>;
};

const Tab = createMaterialBottomTabNavigator();

const RootNavigator = () => {
    const [dispatch, selectStore] = useReduxStore("auth");
    const isLoggedIn = selectStore('isLoggedIn')
    console.log(isLoggedIn, "<=== isLoggedIn")

    return (
        <Tab.Navigator
            initialRouteName="LandingPage"
            activeColor={colors.transparent}
            inactiveColor={colors.white}
            barStyle={{
                backgroundColor: colors.white,
                color: 'red'
            }}
            screenOptions={{

            }}
            // labeled={false}
            style={{
                color: 'red'
            }}
            shifting
        >
            {/* Posts */}
            <Tab.Screen
                name="Landing"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome
                            name="globe"
                            color={focused ? colors.ravrPurple : colors.blue1}
                            size={24}
                        />
                    ),
                }}
            />

            {/* Trips */}
            {
                isLoggedIn && (
                    <Tab.Screen
                        name="Trips"
                        component={MyTripsNavigator}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <Fontisto
                                    name="plane"
                                    color={focused ? colors.ravrPurple : colors.blue1}
                                    size={24}
                                />
                            )
                        }}
                    />
                )
            }

            {/* Finace */}
            {/* {
                isLoggedIn && (
                    <Tab.Screen
                        name="Finance"
                        component={WalletNavigator}
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <Ionicons
                                    name="md-wallet-outline"
                                    color={focused ? colors.ravrPurple : colors.blue1}
                                    size={24}
                                />
                            )
                        }}
                    />
                )
            } */}

            {/* User */}
            <Tab.Screen
                name="User"
                component={ProfileNavigator}
                options={{
                    tabBarColor: !isLoggedIn && colors.ravrPurple,
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome5
                            name="user-alt"
                            color={focused ? isLoggedIn ? colors.ravrPurple : colors.blue1 : colors.blue1}
                            size={24}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

export default RootNavigator;