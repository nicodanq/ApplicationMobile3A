// LoginScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptEmails, setAcceptEmails] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = () => {
    console.log('Login attempt:', { email, password, acceptEmails, acceptTerms });
  };

  const CheckboxItem = ({ checked, onPress, text }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      <Text style={styles.checkboxText}>{text}</Text>
    </TouchableOpacity>
  );

  const ValidationItem = ({ isValid, text }) => (
    <View style={styles.validationItem}>
      <View style={[styles.validationCircle, isValid && styles.validationCircleValid]}>
        {isValid && <Ionicons name="checkmark" size={12} color="white" />}
      </View>
      <Text style={[styles.validationText, isValid && styles.validationTextValid]}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Se connecter</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Adresse email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Validation */}
          <View style={styles.validationContainer}>
            <ValidationItem
              isValid={hasMinLength}
              text="8 caractères minimum"
            />
            <ValidationItem
              isValid={hasUpperLower}
              text="Doit contenir des lettres majuscules et minuscules"
            />
            <ValidationItem
              isValid={hasSpecialChar}
              text="Doit contenir au moins un caractère spécifique"
            />
          </View>

          {/* Checkboxes */}
          <View style={styles.checkboxSection}>
            <CheckboxItem
              checked={acceptEmails}
              onPress={() => setAcceptEmails(!acceptEmails)}
              text="Je souhaite recevoir par e-mail les nouvelles offres d'études et les dernières mises à jour."
            />
            <CheckboxItem
              checked={acceptTerms}
              onPress={() => setAcceptTerms(!acceptTerms)}
              text="En m'inscrivant, tu confirmes que tu acceptes les Termes & Conditions générales, avoir lu la politique de confidentialité et avoir au moins 18 ans."
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!email || !password || !hasMinLength || !hasUpperLower || !hasSpecialChar) &&
                styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!email || !password || !hasMinLength || !hasUpperLower || !hasSpecialChar}
          >
            <Text style={styles.submitButtonText}>Valider</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>EPF</Text>
          </View>
          <Text style={styles.logoTitle}>EPF Projects</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
    marginHorizontal: -20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  validationContainer: {
    marginBottom: 20,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  validationCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  validationCircleValid: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  validationText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  validationTextValid: {
    color: '#4CAF50',
  },
  checkboxSection: {
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#4A5568',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A5568',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
  },
});

export default LoginScreen;