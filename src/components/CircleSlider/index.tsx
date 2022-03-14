import React, { FC } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ReText } from 'react-native-redash';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  btnRadius?: number;
  dialRadius?: number;
  dialWidth?: number;
  meterColor?: string;
  textColor?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  textSize?: number;
  value?: number;
  min?: number;
  max?: number;
  xCenter?: number;
  yCenter?: number;
  onValueChange?: (x: number) => number;
}

const CircleSlider: FC<Props> = ({
  btnRadius = 15,
  dialRadius = 130,
  dialWidth = 5,
  meterColor = '#0cd',
  textColor = '#fff',
  fillColor = 'none',
  strokeColor = '#ccc',
  strokeWidth = 2,
  textSize = 10,
  value = 0,
  min = 0,
  max = 359,
  xCenter = Dimensions.get('window').width / 2,
  yCenter = Dimensions.get('window').height / 2,
  onValueChange = x => x,
}) => {
  const angleAnimated = useSharedValue(value);

  const polar2Cartesian = (convertAngle: number) => {
    'worklet';
    let r = dialRadius;
    let hC = dialRadius + btnRadius;
    let a = ((convertAngle - 90) * Math.PI) / 180.0;

    let x = hC + r * Math.cos(a);
    let y = hC + r * Math.sin(a);
    return { x, y };
  };

  const cartesianToPolar = (x: number, y: number) => {
    'worklet';
    let hC = dialRadius + btnRadius;

    if (x === 0) {
      return y > hC ? 0 : 180;
    } else if (y === 0) {
      return x > hC ? 90 : 270;
    } else {
      return (
        Math.round((Math.atan((y - hC) / (x - hC)) * 180) / Math.PI) +
        (x >= hC ? 90 : 270)
      );
    }
  };

  const width = (dialRadius + btnRadius) * 2;
  const dR = dialRadius;
  const percentCoords = width / 2 - 150 / 2;

  const startCoord = useDerivedValue(() => {
    return polar2Cartesian(0);
  });
  const endCoord = useDerivedValue(() => {
    return polar2Cartesian(angleAnimated.value);
  });
  const angleConverted = useDerivedValue(() => {
    return String(angleAnimated.value);
  });
  const percentValue = useDerivedValue(() => {
    return `${((angleAnimated.value * 100) / 360).toFixed(1)}%`;
  });

  const animatedProps = useAnimatedProps(() => {
    const path = `
      M${startCoord.value.x} ${startCoord.value.y} 
      A ${dR} ${dR} 0 ${angleAnimated.value > 180 ? 1 : 0} 
      1 ${endCoord.value.x} ${endCoord.value.y}`;
    return {
      d: path,
    };
  });

  const animatedCursorStyle = useAnimatedStyle(() => {
    return {
      top: endCoord.value.y - 30 / 2,
      left: endCoord.value.x - 30 / 2,
    };
  });

  const panGesture = Gesture.Pan().onUpdate(e => {
    let xOrigin = xCenter - (dialRadius + btnRadius);
    let yOrigin = yCenter - (dialRadius + btnRadius);
    let a = cartesianToPolar(e.absoluteX - xOrigin, e.absoluteY - yOrigin);

    if (a <= min) {
      angleAnimated.value = min;
    } else if (a >= max) {
      angleAnimated.value = max;
    } else {
      angleAnimated.value = a;
    }
  });

  return (
    <View style={styles.container}>
      <Svg width={width} height={width}>
        <Circle
          r={dR}
          cx={width / 2}
          cy={width / 2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={fillColor}
        />
        <AnimatedPath
          stroke={meterColor}
          strokeWidth={dialWidth}
          fill="none"
          animatedProps={animatedProps}
        />
      </Svg>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cursor, animatedCursorStyle]}>
          <ReText text={angleConverted} />
        </Animated.View>
      </GestureDetector>
      <View
        style={[styles.percent, { top: percentCoords, left: percentCoords }]}
      >
        <ReText style={styles.percentText} text={percentValue} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  cursor: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#0cd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    position: 'absolute',
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 45,
    color: 'black',
  },
});

export default React.memo(CircleSlider);
