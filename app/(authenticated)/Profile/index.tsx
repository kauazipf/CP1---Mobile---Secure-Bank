// Novo design da tela de perfil com correções e visual moderno
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const router = useRouter();
  const { usuario, handleLogout } = useAuth();
  const [biometria, setBiometria] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("@allow-fingerprint");
      setBiometria(saved === "true");
    })();
  }, []);

  const toggleBiometria = async () => {
    const novoValor = !biometria;
    await AsyncStorage.setItem("@allow-fingerprint", novoValor ? "true" : "false");
    setBiometria(novoValor);
  };

  const confirmLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: handleLogout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        <Text style={styles.title}>Meu Perfil</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{usuario?.nome}</Text>

          <Text style={styles.label}>Apelido</Text>
          <Text style={styles.value}>@{usuario?.apelido}</Text>

          <Text style={styles.label}>CPF</Text>
          <Text style={styles.value}>{usuario?.cpf}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{usuario?.email || 'Não informado'}</Text>

          <Text style={styles.label}>Celular</Text>
          <Text style={styles.value}>{usuario?.telefone || 'Não informado'}</Text>

          <Text style={styles.label}>Desde</Text>
          <Text style={styles.value}>{new Date(usuario?.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Login com biometria</Text>
            <Switch value={biometria} onValueChange={toggleBiometria} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 22,
    color: '#6b256f',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6b256f',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#111827',
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#6b256f',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 30,
  },
});
