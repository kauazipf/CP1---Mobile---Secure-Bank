import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';

export default function Recive() {
  const [carregando, setCarregando] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [apelido, setApelido] = useState('');

  const router = useRouter();

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      setCarregando(true);
      setTimeout(() => {
        setNomeUsuario('Kaua Zipf');
        setApelido('kauazinho');
        setCarregando(false);
      }, 1000);
    };
    carregarDadosUsuario();
  }, []);

  const copiarApelido = () => {
    Alert.alert('Copiado', 'Chave Pix copiada para a área de transferência');
  };

  const compartilharApelido = async () => {
    Alert.alert('Compartilhar', 'Chave Pix compartilhada (simulado)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>◄</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Receber Pix</Text>
        <View style={{ width: 30 }} />
      </View>

      {carregando ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6b256f" />
          <Text style={styles.loadingText}>Carregando suas informações...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.profileBox}>
            <Text style={styles.subtitle}>Você está recebendo como</Text>
            <Text style={styles.profileName}>{nomeUsuario}</Text>
          </View>

          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrLabel}>[ QR CODE ]</Text>
            <Text style={styles.qrHint}>Simulação de código para recebimento</Text>
          </View>

          <View style={styles.pixContainer}>
            <Text style={styles.pixLabel}>Chave Pix</Text>
            <View style={styles.pixRow}>
              <Text style={styles.pixText}>{apelido}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={copiarApelido}>
                <Text style={styles.copyText}>Copiar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.shareButton} onPress={compartilharApelido}>
              <Text style={styles.shareText}>Compartilhar Apelido</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf4ff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6b256f',
  },
  back: {
    color: '#fff',
    fontSize: 26,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef6ff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b21a8',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  profileBox: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#7e22ce',
    marginBottom: 6,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4c1d95',
  },
  qrPlaceholder: {
    backgroundColor: '#f3e8ff',
    borderRadius: 16,
    paddingVertical: 60,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#d8b4fe',
  },
  qrLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7e22ce',
  },
  qrHint: {
    marginTop: 8,
    fontSize: 13,
    color: '#a855f7',
  },
  pixContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pixLabel: {
    fontSize: 15,
    color: '#6b21a8',
    marginBottom: 10,
  },
  pixRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fdf2f8',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  pixText: {
    fontSize: 16,
    color: '#6b21a8',
  },
  copyButton: {
    backgroundColor: '#f5d0fe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7e22ce',
  },
  shareButton: {
    backgroundColor: '#6b256f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
