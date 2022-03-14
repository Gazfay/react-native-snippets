import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

const DayComponent = props => {
  console.log(props, 'Props');
  return (
    <View>
      <Text>{props.date.format("ddd")}</Text>
    </View>
  );
};

const Calendar = () => {
  return (
    <View style={styles.container}>
      <CalendarStrip
        scrollable
        style={{ height: 100, paddingTop: 20, paddingBottom: 10, paddingLeft: 0, paddingRight: 0, }}
        calendarColor={'#3343CE'}
        calendarHeaderStyle={{ color: 'white' }}
        dateNumberStyle={{ color: 'white' }}
        dateNameStyle={{ color: 'white' }}
        leftSelector={[]}
        rightSelector={[]}
        onWeekChanged={(start, end) => console.log(start.format('DD.MM.YYYY'), end.format('DD.MM.YYYY'))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Calendar;
