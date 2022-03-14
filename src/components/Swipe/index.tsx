import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';

const Swipe = () => {
  const position = useSharedValue(0);
  const { width } = useWindowDimensions();
  const translateThreshHold = -width * 0.3;
  const translateLastThreshold = -width / 2;
  const animatedText = useSharedValue('First');

  const showMessage = (text: string) => {
    alert(text);
  };

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      console.log(e.translationX, 'X');
      if (e.translationX > 0) {
        position.value = 0;
        return;
      }
      position.value = e.translationX;

      if (position.value < translateLastThreshold) {
        animatedText.value = 'Last';
      } else {
        animatedText.value = 'First';
      }
    })
    .onEnd(e => {
      console.log(translateThreshHold, translateLastThreshold, 'X');

      if (position.value > translateThreshHold) {
        position.value = withTiming(0);
      }

      if (
        position.value < translateThreshHold &&
        position.value > translateLastThreshold
      ) {
        position.value = withTiming(0);
        runOnJS(showMessage)('First action');
      }

      if (position.value < translateLastThreshold) {
        position.value = withTiming(-width);
        runOnJS(showMessage)('Last action');
      }

      // position.value = withTiming(0);
      // } else {
      //   position.value = withTiming(0);
      // }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: position.value < translateLastThreshold ? 'green' : 'blue',
  }));

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={panGesture}>
        <>
          <Animated.View style={[styles.container, animatedStyle]}>
            <Text>Swipe text</Text>
          </Animated.View>
          <Animated.View style={[styles.actions, bgAnimatedStyle]}>
            <ReText text={animatedText} style={styles.text} />
          </Animated.View>
        </>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  wrapper: {
    position: 'relative',
  },
  actions: {
    position: 'absolute',
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 10,
    zIndex: -1,
  },
  text: {
    marginRight: 15,
    color: '#fff',
  },
});

export default Swipe;
