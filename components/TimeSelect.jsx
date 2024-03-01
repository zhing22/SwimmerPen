import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const TimeSelect = ({ value, setValue, label }) => {
  const [show, setShow] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        position: "relative",
      }}
      onPress={() => {
        setShow(!show);
      }}
    >
      <Text
        style={{
          color: "rgb(154,154,154)",
          fontSize: 18,
          position: "absolute",
          left: 10,
          top: -9,
          zIndex: 10,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          width: 220,
          height: 55,
          backgroundColor: "#F5F8F9",
          borderRadius: 15,
          padding: 10,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
          }}
        >
          {value.toDateString()}
        </Text>
      </View>
      <Image
        source={require("../assets/down-fill.png")}
        style={{
          width: 9,
          height: 5,
          position: "absolute",
          right: 15,
          top: 25,
        }}
      />
      {show && (
        <View
          style={{
            position: "absolute",
            top: 55,
            left: 0,
            zIndex: 50,
            width: "100%",
            backgroundColor: "#fff",
            shadowOpacity: 0.1,
            shadowColor: "black",
            shadowOffset: 5,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#ddd",
            paddingVertical: 10,
          }}
        >
          <DateTimePicker
            display="inline"
            testID="dateTimePicker"
            value={value}
            mode="date"
            is24Hour={true}
            onChange={(event, selectedDate) => {
              setValue(selectedDate);
              setShow(false);
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default TimeSelect;
