/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import AnimatedHeader from './src/components/AnimatedHeader';
import Ball from './src/components/Ball';
import BottomSheet from './src/components/BottomSheet';
import Box from './src/components/Box';
import CircleSlider from './src/components/CircleSlider';
import PieChart from './src/components/PieChart';
import ProgressCircle from './src/components/ProgressCircle';
import Swipe from './src/components/Swipe';
import Victory from './src/components/VictoryNative';
import Wheel from './src/components/CalendarStrip';
import CustomChart from './src/components/CustomChart';
import CalendarStrip from './src/components/CalendarStrip';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <BottomSheet /> */}
        {/* <Box /> */}
        {/* <PieChart /> */}
        {/* <Wheel /> */}
        {/* <Victory /> */}
        {/* <CustomChart /> */}
        <CalendarStrip />
      </GestureHandlerRootView>
    </SafeAreaView>
    // <SafeAreaProvider style={{flex: 1}}>
    //   <AnimatedHeader />
    // </SafeAreaProvider>
    // <SafeAreaView style={backgroundStyle}>
    //   <Swipe />
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <CircleSlider value={0} />
    //   </View>
    // </SafeAreaView>
    // <ProgressCircle />
  );
};

export default App;
