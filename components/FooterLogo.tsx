
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const FooterLogo = () => {
  return (
    <View style={styles.footerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/EPF_Projets_Logo.png')}
              style={styles.logoCircle}
            />  

            <Text style={styles.logoText}>EPF Projects</Text>
          </View>
        </View>
  )
}
const styles = StyleSheet.create({
  footerContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    color: Colors.light.text,
  },
});

export default FooterLogo

