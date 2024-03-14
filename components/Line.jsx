import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

let initX = 300;
let initY = 300;
export default function Line() {
  // Move
  const positionX = useSharedValue(initX);
  const savedPositionX = useSharedValue(initX);
  const positionY = useSharedValue(initY);
  const savedPositionY = useSharedValue(initY);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      positionX.value = savedPositionX.value + e.translationX;
      positionY.value = savedPositionY.value + e.translationY;
    })
    .onEnd((e) => {
      savedPositionX.value = positionX.value;
      savedPositionY.value = positionY.value;
    });

  // ROtate
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  // Zoom
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: `${(rotation.value / Math.PI) * 180}deg` },
      { scaleX: scale.value },
    ],
    left: positionX.value,
    top: positionY.value,
  }));
  const composed = Gesture.Race(panGesture, rotationGesture, pinchGesture);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <View
            style={{
              width: "100%",
              height: 2,
              backgroundColor: "red",
            }}
          ></View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 100,
    width: 400,
    position: "absolute",
    left: initX,
    top: initY,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
});
