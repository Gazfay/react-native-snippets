import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import bg from './bg.jpg';

const text = `
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam explicabo nam reiciendis adipisci ipsa veniam sapiente est vero asperiores expedita! Reprehenderit ullam at voluptates tempora beatae saepe soluta est eveniet.
`;

const HEADER_EXPANDED_HEIGHT = 300;
const HEADER_COLLAPSED_HEIGHT = 60;

const AnimatedHeader = () => {
  const insets = useSafeAreaInsets();
  const [textWidth, setTextWidth] = useState(0);
  const scrollY = useSharedValue(0);
  const manualScrolling = useSharedValue(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const { width } = useWindowDimensions();

  const onTextLayout = (event: LayoutChangeEvent) => {
    setTextWidth(event.nativeEvent.layout.width);
  };

  const textAnimatedStyle = useAnimatedStyle(() => {
    const marginLeft = interpolate(
      scrollY.value,
      [0, HEADER_EXPANDED_HEIGHT - (HEADER_COLLAPSED_HEIGHT + insets.top)],
      [20, width / 2 - textWidth / 2],
      'clamp',
    );

    return {
      marginLeft,
    };
  });

  useDerivedValue(() => {
    manualScrolling.value = true;
    scrollTo(scrollRef, 0, scrollY.value, true);
    manualScrolling.value = false;
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
    onEndDrag: event => {
      const offset = event.contentOffset.y;
      const scrollArea =
        HEADER_EXPANDED_HEIGHT - (HEADER_COLLAPSED_HEIGHT + insets.top);
      if (offset >= scrollArea / 2 && offset < scrollArea) {
        scrollY.value = scrollArea;
      } else if (offset < scrollArea) {
        scrollY.value = 0;
      }
    },
  });

  const headerAnmatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_EXPANDED_HEIGHT - (HEADER_COLLAPSED_HEIGHT + insets.top)],
      [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT + insets.top],
      {
        extrapolateRight: Extrapolate.CLAMP,
      },
    );

    return { height };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerAnmatedStyle]}>
        <Animated.Image
          source={bg}
          style={[styles.image, headerAnmatedStyle]}
        />
        <Animated.View style={styles.bar}>
          <View style={styles.wrapper}>
            <Animated.Text
              onLayout={onTextLayout}
              style={[styles.text, textAnimatedStyle]}
            >
              Title
            </Animated.Text>
          </View>
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Text>{text}</Text>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingTop: HEADER_EXPANDED_HEIGHT,
  },
  header: {
    backgroundColor: 'lightblue',
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  image: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: HEADER_EXPANDED_HEIGHT,
    resizeMode: 'cover',
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  wrapper: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, .3)',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AnimatedHeader;
