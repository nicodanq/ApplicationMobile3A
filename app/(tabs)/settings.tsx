import React from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';

const SettingsScreen = () => {
    const [isEnabled, setIsEnabled] = React.useState(false);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Paramètres</Text>
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Mode sombre</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
            {/* Ajoutez d'autres paramètres ici */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    settingText: {
        fontSize: 18,
    },
});

export default SettingsScreen;