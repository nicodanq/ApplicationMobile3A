import FooterLogo from '@/components/FooterLogo';
import HeaderPage from '@/components/HeaderPage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

// Définition du type Evenement (venant de main)
type Evenement = {
  id: string;
  date: string;
  titre: string;
  heure: string;
  lieu: string;
  description: string;
};

const evenementsData: Evenement[] = [
  {
    id: '1',
    date: '2025-06-01',
    titre: 'Hackathon EPF',
    heure: '10h - 17h',
    lieu: 'Cachan',
    description: "Un hackathon organisé à l'EPF pour imaginer les solutions technologiques de demain."
  },
  {
    id: '2',
    date: '2025-06-01',
    titre: 'Forum Entreprises',
    heure: '9h - 16h',
    lieu: 'Sceaux',
    description: 'Rencontre entre étudiants et entreprises avec stands, entretiens et ateliers.'
  },
  {
    id: '3',
    date: '2025-06-03',
    titre: 'Conférence IA',
    heure: '14h - 16h',
    lieu: 'Online',
    description: "Conférence sur l'impact de l'IA dans la recherche scientifique."
  },
];

const EvenementsScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
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
    setSelectedDate(selectedDate === day.dateString ? null : day.dateString);
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
    transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }]
  };

  return (
    <View style={styles.container}>
      <HeaderPage title="Évènements" />

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

      <Text style={styles.subtitle}>{selectedDate ? `Évènements du ${selectedDate}` : 'Prochains évènements'}</Text>

      <Animated.View style={[{ opacity: fadeAnim }, bounceStyle, { flex: 1 }]}> 
        <FlatList
          data={evenementsFiltres}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventBlock}>
              <Text style={styles.eventCategory}>🎓 {item.titre}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
              <Text style={styles.eventDetailsStyled}>🕒 {item.heure}   📍 {item.lieu}</Text>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => {
                  setSelectedEvent(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.infoButtonText}>En savoir plus →</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucun évènement ce jour-là.</Text>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </Animated.View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedEvent?.titre}</Text>
            <Text style={styles.modalText}>🕒 {selectedEvent?.heure}</Text>
            <Text style={styles.modalText}>📍 {selectedEvent?.lieu}</Text>
            <Text style={styles.modalText}>{selectedEvent?.description}</Text>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <FooterLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  calendar: { marginBottom: 10, borderRadius: 10 },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 8, textAlign: 'center' },
  eventBlock: { backgroundColor: '#e3f2fd', padding: 16, marginBottom: 12, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  eventCategory: { fontSize: 18, fontWeight: 'bold', color: '#1565c0' },
  eventDescription: { fontSize: 15, color: '#555', marginTop: 4 },
  eventDetailsStyled: { fontSize: 14, color: '#333', marginTop: 6 },
  infoButton: { marginTop: 10, backgroundColor: '#3c6e87', padding: 10, borderRadius: 8, alignSelf: 'flex-start' },
  infoButtonText: { color: 'white', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { width: '85%', backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 6 },
  closeButton: { marginTop: 15, backgroundColor: '#3c6e87', padding: 10, borderRadius: 6 },
  closeButtonText: { color: 'white', textAlign: 'center', fontWeight: '600' },
});

export default EvenementsScreen;
