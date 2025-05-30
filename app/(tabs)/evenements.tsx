import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';

const evenementsData = [
  {
    id: '1',
    date: '2025-06-01',
    titre: 'Hackathon EPF',
    heure: '10h - 17h',
    lieu: 'Cachan',
  },
  {
    id: '2',
    date: '2025-06-01',
    titre: 'Forum Entreprises',
    heure: '9h - 16h',
    lieu: 'Sceaux',
  },
  {
    id: '3',
    date: '2025-06-03',
    titre: 'Conférence IA',
    heure: '14h - 16h',
    lieu: 'Online',
  },
];

const EvenementsScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const calendarFade = useRef(new Animated.Value(1)).current;

  const today = new Date().toISOString().split('T')[0];

  const evenementsFiltres = selectedDate
    ? evenementsData.filter(event => event.date === selectedDate)
    : evenementsData
        .filter(event => event.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date));

  const getMarkedDates = () => {
    const marked: { [date: string]: any } = {};

    evenementsData.forEach(event => {
      marked[event.date] = {
        ...(marked[event.date] || {}),
        marked: true,
        dotColor: 'red',
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...(marked[selectedDate] || {}),
        selected: true,
        selectedColor: '#3c6e87',
        dotColor: 'white',
      };
    }

    return marked;
  };

  const handleDayPress = (day: { dateString: string }) => {
    if (selectedDate === day.dateString) {
      setSelectedDate(null);
    } else {
      setSelectedDate(day.dateString);
    }
  };

  const handleMonthChange = () => {
    calendarFade.setValue(0);
    Animated.timing(calendarFade, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          friction: 3,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [selectedDate]);

  const bounceStyle = {
    transform: [
      {
        translateY: bounceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evènements</Text>
      <Animated.View style={{ opacity: calendarFade }}>
        <Calendar
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          markedDates={getMarkedDates()}
          enableSwipeMonths={true}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#3c6e87',
            selectedDayBackgroundColor: '#3c6e87',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#3c6e87',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#3c6e87',
            selectedDotColor: '#ffffff',
            arrowColor: '#3c6e87',
            monthTextColor: '#3c6e87',
            textMonthFontWeight: 'bold',
            textDayFontWeight: '600',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 14,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          style={styles.calendar}
        />
      </Animated.View>

      <Text style={styles.subtitle}>
        {selectedDate ? `Évènements du ${selectedDate}` : 'Prochains évènements'}
      </Text>

      <Animated.View style={[{ opacity: fadeAnim }, bounceStyle, { flex: 1 }]}>
        <FlatList
          data={evenementsFiltres}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              <Text style={styles.eventTitle}>{item.titre}</Text>
              <Text style={styles.eventDetails}>
                🕒 {item.heure}   📍 {item.lieu}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun évènement ce jour-là.</Text>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  calendar: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  eventCard: {
    backgroundColor: '#f0f4f7',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDetails: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default EvenementsScreen;
