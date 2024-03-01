import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import Select from "../components/Select";
import TimeSelect from "../components/TimeSelect";
import Line from "../components/Line";
import DISTANCE_MAP from "../common/datas";
import moment from "moment";

const Annotation = ({ navigation }) => {
  const markDatas = useRef([]);
  const [showLine, setShowLine] = useState(false);
  const [curPlayPosition, setCurPlayPosition] = useState(0);
  const [visible, setVisible] = React.useState(false);
  const swimStrokeOptions = ["FreeStyle"];
  const [swimStroke, setSwimStroke] = useState(swimStrokeOptions[0]);
  const poolLengthOptions = [25, 50];
  const [poolLength, setPoolLength] = useState("");

  const raceDistanceOptions = [50, 100, 200, 400, 800, 1500];
  const [raceDistance, setRaceDistance] = useState("");

  const swimmerGenderOptions = ["Male", "Fmale"];
  const [swimmerGender, setSwimmerGender] = useState(swimmerGenderOptions[0]);

  const [competitionName, setCompetitionName] = React.useState("");
  const [competitionRound, setCompetitionRound] = React.useState("Finals");
  const [competitionDate, setCompetitionDate] = React.useState(new Date());
  const [swimmerName, setSwimmerName] = React.useState("");
  const { height } = Dimensions.get("window");
  //   console.log("height = ", height);
  const insets = useSafeAreaInsets();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("请允许访问相册");
      }
    })();
  }, []);

  useEffect(() => {
    if (!poolLength || !raceDistance) {
      if (videoRef.current) {
        setVisible(true);
      }
    }
  }, [videoRef.current]);

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    // console.log("result666 = ", result);
    // console.log("assets6666 = ", result.assets[0].uri);
    // console.log("canceled = ", result.canceled);
    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri);
    }
  };

  const [curRangeIndex, setCurRangeIndex] = useState(0);
  if (poolLength && raceDistance) {
    // console.log("cuuu = ", DISTANCE_MAP[`${poolLength}M`][`${raceDistance}M`]);
  }

  useEffect(() => {
    // console.log("markDatas.current = ", markDatas.current);
    // console.log("curRangeIndex = ", curRangeIndex);
    if (markDatas.current[curRangeIndex]) {
      let { timestamp, sc } = markDatas.current[curRangeIndex];
      if (videoRef.current && typeof timestamp === "number") {
        videoRef.current.setPositionAsync(timestamp, {
          toleranceMillisBefore: 0,
          toleranceMillisAfter: 0,
        });
      }
      setCurPlayPosition(timestamp);
      setScNum(sc);
    }
  }, [curRangeIndex]);

  useEffect(() => {
    setCurRangeIndex(0);
    if (poolLength && raceDistance) {
      let curStepArr = DISTANCE_MAP[`${poolLength}M`][`${raceDistance}M`];
      markDatas.current = Array(curStepArr.length)
        .fill()
        .map(() => {
          return {
            timestamp: "",
            sc: 0,
          };
        });
    }
  }, [poolLength, raceDistance]);

  const [scNum, setScNum] = useState(0);
  // console.log("render............");
  return (
    <View style={styles.box}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Home");
        }}
        style={{
          position: "absolute",
          left: 30,
          top: 30,
          zIndex: 10000000,
        }}
      >
        <Image
          source={require("../assets/home.png")}
          style={{
            width: 46,
            height: 41,
          }}
        />
      </TouchableOpacity>
      {visible && (
        <View
          style={{
            position: "absolute",
            zIndex: 1000,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            left: 0,
            top: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 795,
              backgroundColor: "#fff",
              borderRadius: 5,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                Metadata:
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (!poolLength || !raceDistance) {
                    Alert.alert("Please select poolLength and raceDistance!");
                    return;
                  }
                  setVisible(false);
                }}
              >
                <Image
                  source={require("../assets/close.png")}
                  style={{
                    width: 26,
                    height: 26,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                position: "relative",
                zIndex: 100000,
                justifyContent: "space-between",
              }}
            >
              <Select
                label="Swim Stroke"
                value={swimStroke}
                setValue={setSwimStroke}
                options={swimStrokeOptions}
              />

              <Select
                label="Pool Length"
                unit="M"
                value={poolLength}
                setValue={setPoolLength}
                options={poolLengthOptions}
              />

              <Select
                label="Race Distance"
                unit="M"
                value={raceDistance}
                setValue={setRaceDistance}
                options={raceDistanceOptions}
              />
            </View>

            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  position: "relative",
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
                  Competition Name
                </Text>
                <TextInput
                  value={competitionName}
                  onChangeText={(text) => setCompetitionName(text)}
                  style={{
                    width: 400,
                    height: 55,
                    backgroundColor: "#F5F8F9",
                    borderRadius: 15,
                    padding: 10,
                    fontSize: 18,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                position: "relative",
                zIndex: 10000,
              }}
            >
              <View
                style={{
                  position: "relative",
                  marginRight: 50,
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
                  Competition Round
                </Text>
                <TextInput
                  value={competitionRound}
                  onChangeText={(text) => setCompetitionRound(text)}
                  style={{
                    width: 220,
                    height: 55,
                    backgroundColor: "#F5F8F9",
                    borderRadius: 15,
                    padding: 10,
                    fontSize: 18,
                  }}
                />
              </View>
              <TimeSelect
                value={competitionDate}
                setValue={setCompetitionDate}
                label="Competition Date"
              />
            </View>

            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                position: "relative",
                zIndex: 1000,
              }}
            >
              <View
                style={{
                  position: "relative",
                  marginRight: 50,
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
                  Swimmer Name
                </Text>
                <TextInput
                  value={swimmerName}
                  onChangeText={(text) => setSwimmerName(text)}
                  style={{
                    width: 220,
                    height: 55,
                    backgroundColor: "#F5F8F9",
                    borderRadius: 15,
                    padding: 10,
                    fontSize: 18,
                  }}
                />
              </View>
              <Select
                label="Swimmer Gender"
                value={swimmerGender}
                setValue={setSwimmerGender}
                options={swimmerGenderOptions}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#D6D6D6",
                  width: 180,
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  marginRight: 100,
                }}
                onPress={() => {
                  if (!poolLength || !raceDistance) {
                    Alert.alert("Please select poolLength and raceDistance!");
                    return;
                  }
                  setVisible(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    color: "#fff",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#007AFF",
                  width: 180,
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                }}
                onPress={() => {
                  if (!poolLength) {
                    Alert.alert("Please select Pool Length!");
                    return;
                  }
                  if (!raceDistance) {
                    Alert.alert("Please select Race Distance!");
                    return;
                  }
                  setVisible(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    color: "#fff",
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View style={styles.left}>
        {showLine && (
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              zIndex: 10000,
            }}
          >
            <Line />
          </View>
        )}

        {selectedVideo && (
          <Video
            ref={videoRef}
            style={{
              width: "100%",
              height: height,
              backgroundColor: "black",
            }}
            // positionMillis={positionMillis.current}
            source={{
              uri: selectedVideo,
            }}
            onPlaybackStatusUpdate={(status) => {
              if (status.positionMillis) {
                // console.log("status666 = ", status.positionMillis);
              }
              setCurPlayPosition(status.positionMillis);
            }}
            useNativeControls={true}
            resizeMode={ResizeMode.CONTAIN}
            // isLooping
          />
        )}
      </View>

      <View
        style={{
          ...styles.right,
          paddingTop: insets.top,
        }}
      >
        <View style={styles.optBox}>
          <TouchableOpacity onPress={pickVideo}>
            <Image
              source={require("../assets/upload.png")}
              style={{
                width: 23,
                height: 31,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowLine(!showLine);
            }}
          >
            <Image
              source={require("../assets/pencil.png")}
              style={{
                width: 32,
                height: 32,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {}}>
            <Image
              source={require("../assets/robot.png")}
              style={{
                width: 37,
                height: 32,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (videoRef.current) {
                setVisible(true);
              } else {
                Alert.alert("Please import the video first!");
              }
            }}
          >
            <Image
              source={require("../assets/database.png")}
              style={{
                width: 31,
                height: 36,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (!videoRef.current) {
                Alert.alert("Please import the video first!");
                return;
              }
              if (!poolLength || !raceDistance) {
                Alert.alert("Please set metadata first!");
                return;
              }
              if (curRangeIndex == 0) {
                return;
              }
              setCurRangeIndex(curRangeIndex - 1);
            }}
          >
            <Image
              source={require("../assets/left.png")}
              style={{
                width: 20,
                height: 33,
              }}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              marginHorizontal: 15,
            }}
          >
            {poolLength &&
              raceDistance &&
              DISTANCE_MAP[`${poolLength}M`][`${raceDistance}M`][curRangeIndex]}
            M
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (
                curRangeIndex ==
                DISTANCE_MAP[`${poolLength}M`][`${raceDistance}M`].length - 1
              ) {
                return;
              }
              setCurRangeIndex(curRangeIndex + 1);
            }}
          >
            <Image
              source={require("../assets/right.png")}
              style={{
                width: 20,
                height: 33,
              }}
            />
          </TouchableOpacity>
        </View>
        {/*  */}
        <View
          style={{
            marginTop: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              Timestamp:
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                marginRight: 15,
                width: 80,
              }}
            >
              {moment.utc(curPlayPosition || 0).format("mm:ss:SS")}
            </Text>
            <TouchableOpacity
              style={{
                marginLeft: 15,
              }}
              onPress={() => {
                if (!videoRef.current) {
                  Alert.alert("Please import the video first!");
                  return;
                }
                if (!poolLength || !raceDistance) {
                  Alert.alert("Please set metadata first!");
                  return;
                }
                markDatas.current[curRangeIndex].timestamp = curPlayPosition;
              }}
            >
              <Image
                source={require("../assets/check.png")}
                style={{
                  width: 32,
                  height: 28,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/*  */}
        {/*  */}
        <View
          style={{
            marginTop: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              {poolLength &&
              raceDistance &&
              DISTANCE_MAP[`${poolLength}M`][`${raceDistance}M`][
                curRangeIndex - 1
              ]
                ? poolLength &&
                  raceDistance &&
                  DISTANCE_MAP[`${poolLength}M`][`${raceDistance}M`][
                    curRangeIndex - 1
                  ]
                : 0}
            </Text>
            <Text
              style={{
                marginHorizontal: 5,
                color: "#fff",
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              -
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                marginBottom: 10,
              }}
            >
              {poolLength &&
                raceDistance &&
                DISTANCE_MAP[`${poolLength}M`][`${raceDistance}M`][
                  curRangeIndex
                ]}
              M SC:
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (!videoRef.current) {
                  Alert.alert("Please import the video first!");
                  return;
                }
                if (!poolLength || !raceDistance) {
                  Alert.alert("Please set metadata first!");
                  return;
                }
                if (scNum == 0) {
                  return;
                }
                setScNum(scNum - 1);
              }}
            >
              <Image
                source={require("../assets/minus.png")}
                style={{
                  width: 27,
                  height: 6,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                marginHorizontal: 15,
              }}
            >
              {scNum}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (!videoRef.current) {
                  Alert.alert("Please import the video first!");
                  return;
                }
                if (!poolLength || !raceDistance) {
                  Alert.alert("Please set metadata first!");
                  return;
                }
                setScNum(scNum + 1);
              }}
            >
              <Image
                source={require("../assets/plus.png")}
                style={{
                  width: 29,
                  height: 29,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: 15,
              }}
              onPress={() => {
                if (!videoRef.current) {
                  Alert.alert("Please import the video first!");
                  return;
                }
                if (!poolLength || !raceDistance) {
                  Alert.alert("Please set metadata first!");
                  return;
                }
                markDatas.current[curRangeIndex].sc = scNum;
              }}
            >
              <Image
                source={require("../assets/check.png")}
                style={{
                  width: 32,
                  height: 28,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/*  */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 0,
            bottom: 20,
            width: 220,
          }}
          onPress={() => {
            if (!videoRef.current) {
              Alert.alert("Please import the video first!");
              return;
            }
            if (!poolLength || !raceDistance) {
              Alert.alert("Please set metadata first!");
              return;
            }
            let markDatasArr = [];
            let curStepArr = DISTANCE_MAP[`${poolLength}M`][`${raceDistance}M`];
            markDatas.current.forEach((v, i) => {
              markDatasArr.push({
                name: `${curStepArr[i]}M`,
                timestamp: v.timestamp || 0,
                sc: v.sc,
              });
            });
            // 获取到的所有元数据与标记数据
            let metadata = {
              swimStroke,
              poolLength,
              raceDistance,
              competitionName,
              competitionRound,
              competitionDate,
              swimmerName,
              swimmerGender,
              markDatas: markDatasArr,
            };
            console.log("metadata = ", metadata);
            navigation.navigate("Statistics", {
              metadata: JSON.stringify(metadata),
            });
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              marginRight: 30,
            }}
          >
            Statistics
          </Text>
          <Image
            source={require("../assets/arrow-right.png")}
            style={{
              width: 33,
              height: 33,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
  },
  left: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },
  right: {
    width: 200,
    backgroundColor: "#2D2D2D",
    paddingHorizontal: 15,
    position: "relative",
  },
  optBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
  },
});

export default Annotation;
