import React from "react";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from "@react-navigation/native";
import useReduxStore from "../utils/hooks/useRedux";
import CreateWallet from "../screens/createWallet";
import Wallet from "../screens/wallet";

export type Routes = {
    CreateWallet: undefined;
    Wallet: undefined;
};

export type AuthNavigationProps<T extends keyof Routes> = {
    navigation: NativeStackNavigationProp<Routes, T>;
    route: RouteProp<Routes, T>;
};

const Stack = createNativeStackNavigator<Routes>();

const WalletNavigator = () => {
    const [dispatch, selectStore] = useReduxStore("auth");
    const user = selectStore("user")
    const { wallets } = user
    console.log(user)

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            {
                wallets && wallets.length < 1 && (
                    <Stack.Screen
                        name="CreateWallet"
                        component={CreateWallet}
                    />
                )
            }

            {
                wallets && wallets.length > 0 && (
                    <Stack.Screen
                        name="Wallet"
                        component={Wallet}
                    />
                )
            }

        </Stack.Navigator>
    );
}

export default WalletNavigator;