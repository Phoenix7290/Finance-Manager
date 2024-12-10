import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Dimensions, ScrollView, Text } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LoginScreen({ navigation }) {
  const [isPortrait, setIsPortrait] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get('window');
      setIsPortrait(height >= width);
    };

    Dimensions.addEventListener('change', updateLayout);
    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Transacoes');
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isPortrait ? styles.portrait : styles.landscape]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingWrapper}>
            <LottieView
              source={require('../../assets/animations/loading.json')}
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: 'https://i.pravatar.cc/300' }}
            />
          </View>

          <Text style={styles.welcomeText}>
            Bem-vindo de volta!
          </Text>

          <View>
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              placeholderTextColor="#aaa"
            />
          </View>

          <View>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#aaa"
              secureTextEntry={true}
            />
          </View>

          <View>
            <Button
              title="Acessar"
              onPress={handleLogin}
              color="#45b1f5"
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#e0f7fa' },
  portrait: { flexDirection: 'column' },
  landscape: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  profileImageContainer: { marginBottom: 24 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#00796b' },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#004d40', marginBottom: 24 },
  input: { width: '100%', height: 55, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 16, backgroundColor: '#ffffff', fontSize: 16, borderColor: '#004d40' },
  inputContainer: { marginBottom: 16 },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingWrapper: {
    width: 150,
    height: 150,
  },
  loadingAnimation: {
    width: '100%',
    height: '100%',
  },
});
