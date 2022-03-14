import React from 'react';
import { Dimensions, View, StyleSheet, Text as TSpan } from 'react-native';
import { Svg, Text, G, Circle, Path, Line } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { scaleLinear } from 'd3-scale';
const { width, height } = Dimensions.get('screen');

const numberOfSegments = 12;
const wheelSize = width * 0.55;
const fontSize = 10;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;

type DataType = number[];

const makeWheel = () => {
  const data: DataType = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const arcs = d3Shape.pie()(data);
  console.log(arcs, 'Data here');

  return arcs.map(item => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(wheelSize / 2)
      .innerRadius(20);
    //@ts-ignore
    const path = instance(item);

    return {
      path,
      color: 'green',
    };
  });
};

const makeLabels = () => {
  const data = Array.from({ length: numberOfSegments }).fill(1);
  const arcs = d3Shape.pie()(data);

  return arcs.map((arc, index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(wheelSize / 2)
      .innerRadius(wheelSize / 4);

    return {
      path: instance(arc),
      //color: 'green',
      value: index * 10, //[200, 2200]
      centroid: instance.centroid(arc),
    };
  });
};

const makePoints = (num: number) => {
  const scale = scaleLinear().range([0, wheelSize]).domain([-1, 1]);

  var angle = (2 * Math.PI) / num;
  var points = [];
  var i = 0;
  for (var a = 0; a < 2 * Math.PI; a += angle) {
    i++;
    points.push({
      x: scale(Math.cos(a)),
      y: scale(Math.sin(a)),
      rotationDeg: a * (180 / Math.PI),
      label: 'point' + i,
    });
  }
  return points;
};

const CustomChart = () => {
  const renderLine = (x, y, deg) => {
    console.log(deg, 'Deg');
    if (deg > 90 && deg < 270) {
      return (
        <Line
          x1={x + xPadding}
          y1={y + yPadding}
          x2={0}
          y2={y + yPadding}
          stroke="black"
          strokeWidth="2"
        />
      );
    }

    if (deg < 90 || deg > 270) {
      return (
        <Line
          x1={x + xPadding}
          y1={y + yPadding}
          x2={width}
          y2={y + yPadding}
          stroke="black"
          strokeWidth="2"
        />
      );
    }

    if (deg === 270) {
      return (
        <Line
          x1={x + xPadding}
          y1={y + yPadding}
          x2={x + xPadding}
          y2={0}
          stroke="black"
          strokeWidth="2"
        />
      );
    }

    if (deg === 90) {
      return (
        <Line
          x1={x + xPadding}
          y1={y + yPadding}
          x2={x + xPadding}
          y2={svgHeight}
          stroke="black"
          strokeWidth="2"
        />
      );
    }
  };

  const renderLabel = (cx, cy, rotationDeg, points, index, l) => {
    const getTextPadding = deg => {
      if (deg > 0 && deg < 180) {
        return 20;
      }

      return 10;
    };

    const label = rotationDeg.toFixed(2);
    let nextPoint = points[index + 1] ? points[index + 1] : points[0];
    nextPoint =
      rotationDeg < 90 || rotationDeg > 270 ? nextPoint : points[index];
    const x = nextPoint.x;
    const y = nextPoint.y;

    if (rotationDeg > 90 && rotationDeg < 270) {
      return (
        <Text
          x={x + xPadding - getTextPadding(rotationDeg)}
          y={y + yPadding - 5}
          fill="white"
          textAnchor="end"
          fontSize={13}
          fontWeight="normal"
        >
          {label}
        </Text>
      );
    }

    if (rotationDeg < 90 || rotationDeg > 270) {
      return (
        <Text
          x={x + xPadding + getTextPadding(rotationDeg)}
          y={y + yPadding - 5}
          fill="white"
          textAnchor="start"
          fontSize={13}
          fontWeight="normal"
        >
          {label}
        </Text>
      );
    }

    if (rotationDeg === 270) {
      return (
        <Text
          x={x + xPadding + getTextPadding(rotationDeg)}
          y={y + yPadding - 5}
          fill="white"
          textAnchor="start"
          fontSize={13}
          fontWeight="normal"
        >
          {label}
        </Text>
      );
    }

    if (rotationDeg === 90) {
      return (
        <Text
          x={x + xPadding + getTextPadding(rotationDeg)}
          y={y + yPadding - 5}
          fill="white"
          textAnchor="start"
          fontSize={13}
          fontWeight="normal"
        >
          {label}
        </Text>
      );
    }
  };

  const wheelPaths = makeWheel();
  const wheelLables = makeLabels();
  const points = makePoints(numberOfSegments);
  const pieces = points.map((item, index) => {
    let nextItem = points[index + 1] ? points[index + 1] : points[0];
    return {
      startAnglePoint: item,
      endAnglePoint: nextItem,
    };
  });

  const svgHeight = height / 3;
  const xPadding = (width - wheelSize) / 2;
  const yPadding = (svgHeight - wheelSize) / 2;
  const center = { x: width / 2, y: svgHeight / 2 };

  const renderSvgWheel = () => {
    return (
      <View style={styles.svgWrapper}>
        <Svg
          width={width}
          height={svgHeight}
          style={{ backgroundColor: 'red' }}
          // style={{ flex: 1 }}
          // viewBox={`0 0 ${width} ${width}`}
          //style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}
        >
          <G y={svgHeight / 2} x={width / 2}>
            {wheelPaths.map((arc, i: number) => {
              const labelArc = wheelLables[i];
              const [x, y] = labelArc.centroid;
              const number = labelArc.value.toString();

              return (
                <G key={`arc-${i}`}>
                  <Path d={arc.path} fill={arc.color} />
                  <G x={x} y={y}>
                    <Circle r="12" fill="white" />
                    <Text
                      // x={x}
                      // y={y + 4}
                      y={3}
                      fill="black"
                      textAnchor="middle"
                      fontSize={fontSize}
                      fontWeight="bold"
                    >
                      {number}
                    </Text>
                  </G>
                </G>
              );
            })}
          </G>
          {/* <G x={paddingLeft} y={paddingRight}>
            {points.map(({ x, y }) => {
              return (
                <G>
                  <Circle r="5" x={x} y={y} fill="black" />
                  <Line
                    x1={0}
                    y1={0}
                    x2={x}
                    y2={y}
                    stroke="black"
                    strokeWidth="2"
                  />
                </G>
              );
            })}
          </G> */}
          {points.map(({ x, y, rotationDeg, label }, index, array) => {
            return (
              <G>
                <Line
                  x1={center.x}
                  y1={center.y}
                  x2={x + xPadding}
                  y2={y + yPadding}
                  stroke="black"
                  strokeWidth="2"
                />
                {renderLabel(x, y, rotationDeg, array, index, label)}
                {renderLine(x, y, rotationDeg)}
              </G>
            );
          })}
          {pieces.map((piece, index) => {
            return (
              <G>
                <Line
                  x1={center.x}
                  y1={center.y}
                  x2={x + xPadding}
                  y2={y + yPadding}
                  stroke="black"
                  strokeWidth="2"
                />
                {renderLabel(x, y, rotationDeg, array, index, label)}
                {renderLine(x, y, rotationDeg)}
              </G>
            );
          })}
        </Svg>
      </View>
    );
  };

  return <View style={styles.container}>{renderSvgWheel()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomChart;
