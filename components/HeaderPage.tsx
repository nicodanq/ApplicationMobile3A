import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface HeaderPageProps {
    title: string
}

const HeaderPage: React.FC<HeaderPageProps> = ({ title }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.headerLine} />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 28,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: "#F8FAFC",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1E293B",
        textAlign: "center",
        marginBottom: 12,
    },
    headerLine: {
        height: 2,
        backgroundColor: "#E2E8F0",
        marginHorizontal: 40,
    },
})

export default HeaderPage