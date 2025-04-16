import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

export default function TransactionDetail() {
  const router = useRouter();
  const { transacao } = useLocalSearchParams();

  const dados = transacao
    ? JSON.parse(decodeURIComponent(transacao as string))
    : null;

  if (!dados) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Transação não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const isEntrada = dados.tipo === 'recebida';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Detalhes da Transação</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Descrição</Text>
          <Text style={styles.value}>{dados.descricao}</Text>

          <Text style={styles.label}>Valor</Text>
          <Text
            style={[
              styles.value,
              { color: isEntrada ? '#22c55e' : '#ef4444' },
            ]}
          >
            {isEntrada ? '+' : '-'} R$ {dados.valor.toFixed(2).replace('.', ',')}
          </Text>

          <Text style={styles.label}>Data</Text>
          <Text style={styles.value}>
            {new Date(dados.data).toLocaleDateString('pt-BR')}
          </Text>

          <Text style={styles.label}>Categoria</Text>
          <Text style={styles.value}>{dados.categoria}</Text>

          <Text style={styles.label}>
            {isEntrada ? 'De' : 'Para'}
          </Text>
          <Text style={styles.value}>{dados.contraparte.nome} (@{dados.contraparte.apelido})</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf4ff',
  },
  scroll: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#6b256f',
  },
  back: {
    fontSize: 24,
    color: '#fff',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#7e22ce',
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    color: '#4c1d95',
    fontWeight: '600',
    marginTop: 4,
  },
  error: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
