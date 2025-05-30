import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';

type Evenement = {
  id: string;
  date: string;
  titre: string;
  heure: string;
  lieu: string;
};

const evenementsData: Evenement[] = [
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

  const evenementsFiltres = selectedDate
    ? evenementsData.filter(event => event.date === selectedDate)
    : evenementsData;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evènements</Text>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={
          selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  marked: true,
                  selectedColor: '#3c6e87',
                },
              }
            : {}
        }
        style={styles.calendar}
      />

      <Text style={styles.subtitle}>
        {selectedDate ? `Évènements du ${selectedDate}` : 'Tous les évènements'}
      </Text>

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
      />
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
