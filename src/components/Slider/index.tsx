import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const Slider = () => {
  const hitSlop = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };
  const [value, setValue] = useState(0);
  const [lineSize, setLineSize] = useState(0);
  const maxValue = 1;
  const minValue = 0;
  const step = 0.2;
  const thumbPosition = useSharedValue(0);
  const startPosition = useSharedValue(0);

  const onViewLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    console.log(width, 'Line size');
    setLineSize(width);
  };

  const getThumbStepPosition = (animatedValue: number) => {
    'worklet';
    const length = lineSize;
    const thumbCenter = animatedValue;

    const ratio = thumbCenter / length;

    const stepValue = Math.max(
      minValue,
      Math.min(
        maxValue,
        minValue + Math.round((ratio * (maxValue - minValue)) / step) * step,
      ),
    );

    const stepCorrectValue = Number(stepValue.toFixed(1));
    return stepCorrectValue * lineSize;
  };

  const setStepValue = (animatedValue: number) => {
    const length = lineSize;
    const thumbCenter = animatedValue;

    const ratio = thumbCenter / length;

    const stepValue = Math.max(
      minValue,
      Math.min(
        maxValue,
        minValue + Math.round((ratio * (maxValue - minValue)) / step) * step,
      ),
    );

    setValue(Number(stepValue.toFixed(1)));
  };

  const setSourceValue = (animatedValue: number) => {
    setValue(animatedValue / lineSize);
  };

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      const nextValue = e.translationX + startPosition.value;
      let nextCorrectValue = 0;

      if (nextValue < 0) {
        nextCorrectValue = 0;
      } else if (nextValue > lineSize) {
        nextCorrectValue = lineSize;
      } else {
        nextCorrectValue = nextValue;
      }

      thumbPosition.value = nextCorrectValue;
      runOnJS(setStepValue)(nextCorrectValue);
    })
    .onEnd(() => {
      const endPosition = getThumbStepPosition(thumbPosition.value);
      startPosition.value = endPosition;
      thumbPosition.value = endPosition;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbPosition.value }],
  }));

  return (
    <>
      <View style={styles.container}>
        <View style={styles.line} onLayout={onViewLayout} />
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[styles.thumb, animatedStyle]}
            hitSlop={hitSlop}
          />
        </GestureDetector>
      </View>
      <Text style={{ marginLeft: '50%' }}>{value}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    justifyContent: 'center',
    height: 50,
  },
  line: {
    width: '100%',
    height: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: 'green',
    position: 'absolute',
    marginLeft: -10,
  },
});

export default Slider;
