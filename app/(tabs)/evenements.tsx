import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EvenementsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evènements</Text>
      {/* Tu peux ajouter ici une FlatList ou ScrollView avec des événements */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // pour ne pas coller au haut de l'écran
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
});

export default EvenementsScreen;
