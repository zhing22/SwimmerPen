import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const HomeScreen = ({ navigation }) => {
  const [text, setText] = React.useState("");
  return (
    <View style={styles.box}>
      <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colors={["#a8edea", "#fed6e3"]}
        style={styles.gradientBg}
      >
        <Text style={styles.title}>SwimmerPen</Text>
        <View style={styles.itemBox}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Annotation");
            }}
            style={{
              ...styles.item,
              marginRight: 100,
            }}
          >
            <Image
              source={require("../assets/i1.png")}
              style={{
                width: 292,
                height: 206,
                marginBottom: 30,
              }}
            />
            <Text style={styles.itemLabel}>Annotation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("History");
            }}
            style={styles.item}
          >
            <Image
              source={require("../assets/i2.png")}
              style={{
                width: 229,
                height: 194,
                marginBottom: 42,
              }}
            />
            <Text style={styles.itemLabel}>Statistics</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientBg: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 80,
    marginBottom: 100,
  },
  itemBox: {
    flexDirection: "row",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: 40,
  },
});

export default HomeScreen;
