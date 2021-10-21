import React from "react";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from "@react-navigation/native";
import Profile from "../screens/profile";
import useReduxStore from "../utils/hooks/useRedux";
import Auth from "../screens/auth";
import EmailSignUp from "../screens/emailSignUp";
import EmailSignIn from "../screens/emailSignIn";
import UserNavigator from "./profile";
import Redeem from "../screens/redeem";
import EditProfile from "../screens/editProfile/inde";

export type Routes = {
    Profile: undefined;
    Auth: undefined;
    EmailSignUp: undefined;
    EmailSignIn: undefined;
    Redeem: undefined;
    EditProfile: undefined;
};

export type AuthNavigationProps<T extends keyof Routes> = {
    navigation: NativeStackNavigationProp<Routes, T>;
    route: RouteProp<Routes, T>;
};

const Stack = createNativeStackNavigator<Routes>();

const ProfileNavigator = () => {
    const [dispatch, selectStore] = useReduxStore("auth");
    const isLoggedIn = selectStore("isLoggedIn")

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            {
                !isLoggedIn && (
                    <Stack.Screen
                        name="Auth"
                        component={Auth}
                    />
                )
            }

            {
                !isLoggedIn && <Stack.Screen
                    name="EmailSignUp"
                    component={EmailSignUp}
                />
            }

            {
                !isLoggedIn && <Stack.Screen
                    name="EmailSignIn"
                    component={EmailSignIn}
                />
            }

            {
                isLoggedIn && <Stack.Screen
                    name="Profile"
                    component={Profile}
                />
            }

            {
                isLoggedIn && <Stack.Screen
                    name="Redeem"
                    component={Redeem}
                />
            }

            {
                isLoggedIn && <Stack.Screen
                    name="EditProfile"
                    component={EditProfile}
                />
            }

        </Stack.Navigator>
    );
}

export default ProfileNavigator;