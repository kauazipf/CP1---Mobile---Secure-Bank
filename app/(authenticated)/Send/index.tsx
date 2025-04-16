// Versão redesenhada da tela Send, seguindo o estilo da página Recive
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

export default function Send() {
  const [contaDestino, setContaDestino] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [token, setToken] = useState('');
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const categorias = [
    'Compras Online',
    'Investimentos',
    'Assinaturas',
    'Viagens',
    'Presentes',
    'Serviços',
    'Doações'
  ];

  const formatarValor = (texto: string) => {
    const apenasNumeros = texto.replace(/[^\d]/g, '');
    if (apenasNumeros) {
      const valorNumerico = parseFloat(apenasNumeros) / 100;
      setValor(valorNumerico.toFixed(2).replace('.', ','));
    } else {
      setValor('');
    }
  };

  const enviarDinheiro = async () => {
    if (!contaDestino.trim() || !valor || !categoria) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'O valor deve ser maior que zero');
      return;
    }

    const dadosTransferencia = {
      contaDestino,
      valor: valorNumerico,
      descricao: descricao.trim() || 'Transferência',
      categoria
    };

    setCarregando(true);
    try {
      const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dadosTransferencia),
      });

      if (!resposta.ok) throw new Error('Falha na transferência');

      Alert.alert('Sucesso', `Você enviou R$ ${valor} para ${contaDestino}`, [
        { text: 'OK', onPress: () => router.push('/Dashboard') },
      ]);
    } catch (erro) {
      Alert.alert('Erro', 'Erro ao enviar dinheiro');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    (async () => {
      const tokenSalvo = await AsyncStorage.getItem('@token');
      if (!tokenSalvo) router.push('/Login');
      else setToken(tokenSalvo);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.back}>◄</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Enviar Dinheiro</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Apelido de destino</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: kauazipf"
              value={contaDestino}
              onChangeText={setContaDestino}
            />

            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.input}
              placeholder="0,00"
              keyboardType="numeric"
              value={valor}
              onChangeText={formatarValor}
            />

            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Presente de aniversário"
              value={descricao}
              onChangeText={setDescricao}
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoriasRow}>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategoria(cat)}
                  style={[styles.categoria, categoria === cat && styles.categoriaSelecionada]}
                >
                  <Text style={[styles.categoriaText, categoria === cat && styles.categoriaSelecionadaText]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.botao, carregando && styles.botaoDesativado]}
              onPress={enviarDinheiro}
              disabled={carregando}
            >
              <Text style={styles.botaoTexto}>{carregando ? 'Enviando...' : 'Enviar'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf4ff',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6b256f',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  back: {
    color: '#fff',
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#6b21a8',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f9f5ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  categoriasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  categoria: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoriaSelecionada: {
    backgroundColor: '#6b256f',
  },
  categoriaText: {
    color: '#6b21a8',
    fontSize: 13,
  },
  categoriaSelecionadaText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#6b256f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoDesativado: {
    backgroundColor: '#c4b5fd',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
