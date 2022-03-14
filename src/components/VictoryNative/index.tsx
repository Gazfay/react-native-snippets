import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { VictoryPie, VictoryLabel } from 'victory-native';

const windowWidth = Dimensions.get('window').width;
const height = windowWidth / 1.3;

const data = [
  { x: 'Home &\n Garden', y: 35 },
  { x: 'Beauty', y: 35 },
  { x: 'Health &\n Fitness', y: 35 },
  { x: 'Law', y: 35 },
  { x: 'Professional', y: 35 },
  { x: 'Reasturants', y: 35 },
  { x: 'Real \nEstate', y: 35 },
  { x: 'Consulting', y: 35 },
  { x: 'Pet', y: 35 },
  { x: 'Child care', y: 35 },
  { x: 'Retail', y: 35 },
  { x: 'Automotive', y: 35 },
];

const colors = [
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
  'blue',
];

const Victory = () => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [colorScale, setColorScale] = useState<string[]>(colors.slice());

  const onPress = (_: any, { index }: any) => {
    let newColors = colors.slice();
    if (focusedIndex === index) {
      setFocusedIndex(null);
    } else {
      newColors[index] = 'darkblue';
      setFocusedIndex(index);
    }
    setColorScale(newColors);
  };

  const style = {
    labels: {
      fontSize: 12,
    },
    data: {
      fillOpacity: 0.9,
      stroke: '#fff',
      strokeWidth: 1,
    },
  };

  return (
    <Svg>
      <VictoryPie
        colorScale={colorScale}
        data={data}
        height={height}
        standalone={false}
      />
      <VictoryPie
        colorScale={colorScale}
        data={data}
        height={height}
        standalone={false}
        labelRadius={windowWidth / 5}
        labelComponent={
          <VictoryLabel
            angle={0}
            backgroundStyle={{ fill: 'white' }}
            verticalAnchor="middle"
            textAnchor="middle"
            backgroundComponent={<Circle r="13" cx={6} cy={5} fill="white" />}
          />
        }
        style={style}
        labels={({ datum }) => `${datum.y}`}
        events={[
          {
            target: 'data',
            eventHandlers: {
              onClick: onPress,
              onPress: onPress,
            },
          },
        ]}
      />
      <Circle r="20" x={windowWidth / 2} cy={height / 2} fill="darkblue" />
      <Circle r="13" x={windowWidth / 2} cy={height / 2} fill="white" />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  pie: {
    marginLeft: 10,
  },
});

export default Victory;
