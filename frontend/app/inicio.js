import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Inicio() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.circle} />

      <Text style={styles.title}>Não compre,{'\n'}adote!</Text>

      <TouchableOpacity onPress={() => router.push('/auth')} style={styles.loginButton}>
        <LinearGradient
          colors={['#FFB347', '#FF9800']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={styles.loginText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/cadastro')} style={styles.cadastroButton}>
        <Text style={styles.cadastroText}>Cadastro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  circle: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#FFE0B2',
    position: 'absolute',
    top: -width * 0.2,
    right: -width * 0.2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cadastroButton: {
    padding: 15,
  },
  cadastroText: {
    color: '#666',
    fontSize: 16,
  },
});
