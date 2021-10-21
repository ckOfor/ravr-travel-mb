import React from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import { FontAwesome, Foundation, AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface Props {
    title: string;
    status: string;
    subTitle: string;
    onPress?(): void;
    rightIcon: any;
}

const fetchColor = (status: string) => {
    if(status === "available") return '#FA9F37'
    if(status === "cancelled") return '#F24040'
    if(status === "used") return '#2DA74C'
}

const retunLeftICon = (status: string) => {
    if(status === "available") return <Foundation name="burst-new" size={24} color="white" />
    if(status === "cancelled") return <MaterialCommunityIcons name="account-cancel" size={24} color="white" />
    if(status === "used") return <AntDesign name="swap" size={24} color="white" />
}

function TransactionCard({
    title,
    subTitle,
    onPress,
    status,
    rightIcon
}: // hue = "secondary"
    Props) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: 'rgba(64, 64, 64, 0.04);',
                    padding: 20,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                },
            ]}
            onPress={onPress}
        >
            <View
                style={{
                    flexDirection: 'row'
                }}
            >
                <View
                    style={{
                        width: 34,
                        height: 34,
                        backgroundColor: fetchColor(status),
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {retunLeftICon(status)}
                </View>

                <View
                    style={{
                        marginLeft: 12
                    }}
                >

                    <Text
                        style={{
                            color: '#000000',
                            fontSize: 12
                        }}
                    >
                        {title}
                    </Text>

                    <Text
                        style={{
                            color: '#000000',
                            marginTop: 4,
                            fontSize: 12
                        }}
                    >
                        {subTitle}
                    </Text>

                </View>
            </View>

            {rightIcon}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        // backgroundColor: colors.secondary,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        width: "100%",
        marginVertical: 10,
    },
    text: {
        color: "#fff",
        fontSize: 18,
        textTransform: "uppercase",
        fontWeight: "bold",
    },
});

export default TransactionCard;
