import * as React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import CurrencyInput from "react-native-currency-input";

export function AmountInput() {
  const [value, setValue] = React.useState(2310.458); // can also be null

  return (
    <CurrencyInput
      value={value}
      onChangeValue={setValue}
      prefix="₦"
      delimiter=","
      separator="."
      precision={2}
      style={{ fontSize: 36, color: "#0077FF" }}
      placeholder={"₦ 00.00"}
      placeholderTextColor={"#C1CACF"}
      onChangeText={(formattedValue) => {
        console.log(formattedValue); // $2,310.46
      }}
    />
  );
}
