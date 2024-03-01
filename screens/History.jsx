import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

const History = ({ navigation }) => {
  // 获取到的所有元数据与标记数据
  let metadata = {
    swimStroke: "FreeStyle",
    poolLength: 25,
    raceDistance: 50,
    competitionName: "",
    competitionRound: "Finals",
    competitionDate: "2024-02-21T15:00:37.627Z",
    swimmerName: "",
    swimmerGender: "Male",
    markDatas: [
      { name: "15M", timestamp: 1805, sc: 4 },
      { name: "20M", timestamp: 2950, sc: 3 },
      { name: "25M", timestamp: 0, sc: 0 },
      { name: "40M", timestamp: 0, sc: 0 },
      { name: "45M", timestamp: 0, sc: 0 },
      { name: "50M", timestamp: 0, sc: 0 },
    ],
  };
  // 假数据
  const [datas, setDatas] = useState([metadata, metadata, metadata, metadata]);
  return (
    <LinearGradient
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      colors={["#a8edea", "#fed6e3"]}
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          {datas.map((v, i) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Statistics", {
                    metadata: JSON.stringify(v),
                  });
                }}
                key={i}
                style={{
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  width: "90%",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 30,
                  borderRadius: 10,
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Item{i + 1}
                </Text>
                <Feather name="arrow-right" size={24} color="black" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default History;
