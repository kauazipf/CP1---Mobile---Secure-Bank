import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  StatusBar,
} from 'react-native';

interface ITransacoesProps {
  categoria: string;
  contraparte: {
    apelido: string;
    nome: string;
  };
  data: string;
  descricao: string;
  id: number;
  tipo: string;
  valor: number;
}

export default function Transactions() {
  const [transacoes, setTransacoes] = useState<ITransacoesProps[]>([]);
  const [filtroAtual, setFiltroAtual] = useState('todas');
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [finalLista, setFinalLista] = useState(false);
  const [token, setToken] = useState('');

  const router = useRouter();

  const formatarMoeda = (valor: string | number) => {
    return `R$ ${parseFloat(String(valor)).toFixed(2).replace('.', ',')}`;
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  };

  const buscarTransacoes = async () => {
    if (!token) return;
    try {
      const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await resposta.json();
      setTransacoes(dados);
    } catch (erro) {
      console.error('Erro ao buscar transações:', erro);
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  };

  const getToken = async () => {
    const storedToken = await AsyncStorage.getItem('@token');
    if (!storedToken) {
      router.push('/Login');
      return;
    }
    setToken(storedToken);
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    setPagina(1);
    buscarTransacoes();
  }, [filtroAtual, token]);

  const onRefresh = async () => {
    setAtualizando(true);
    setPagina(1);
    setFinalLista(false);
    await buscarTransacoes();
    setAtualizando(false);
  };

  const carregarMais = () => {
    if (carregandoMais || finalLista) return;
    setPagina((prev) => prev + 1);
    buscarTransacoes();
  };

  const realizarBusca = () => {
    setPagina(1);
    setFinalLista(false);
    buscarTransacoes();
  };

  const renderTransacao = ({ item }: { item: ITransacoesProps }) => {
    const isEntrada = item.tipo === 'recebida';

    return (
      <TouchableOpacity
        style={styles.transacaoItem}
        onPress={() => {
          router.push(`/TransactionDetail?id=${String(item.id)}`);
        }}
      >
        <View style={styles.transacaoIcone}>
          <View
            style={[
              styles.iconeCirculo,
              { backgroundColor: isEntrada ? 'rgba(75, 181, 67, 0.1)' : 'rgba(242, 78, 30, 0.1)' },
            ]}
          >
            <Text style={[styles.iconeTexto, { color: isEntrada ? '#4BB543' : '#F24E1E' }]}>
              {isEntrada ? '↓' : '↑'}
            </Text>
          </View>
        </View>

        <View style={styles.transacaoInfo}>
          <View style={styles.transacaoLinha1}>
            <Text style={styles.transacaoDescricao} numberOfLines={1}>
              {item.descricao}
            </Text>
            <Text style={[styles.transacaoValor, { color: isEntrada ? '#4BB543' : '#F24E1E' }]}>
              {isEntrada ? '+' : '-'}
              {formatarMoeda(item.valor)}
            </Text>
          </View>

          <View style={styles.transacaoLinha2}>
            <Text style={styles.transacaoPessoa} numberOfLines={1}>
              {isEntrada ? `De: ${item.contraparte.apelido}` : `Para: ${item.contraparte.apelido}`}
            </Text>
            <Text style={styles.transacaoData}>{formatarData(item.data)}</Text>
          </View>

          <View style={styles.transacaoLinha3}>
            <View style={styles.categoriaTag}>
              <Text style={styles.categoriaTexto}>{item.categoria}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.buscaContainer}>
      <TextInput
        style={styles.inputBusca}
        placeholder="Buscar transações..."
        value={termoBusca}
        onChangeText={setTermoBusca}
        onSubmitEditing={realizarBusca}
        returnKeyType="search"
      />
      <View style={styles.filtros}>
        {['todas', 'recebidas', 'enviadas'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[styles.filtroBotao, filtroAtual === tipo && styles.filtroBotaoAtivo]}
            onPress={() => setFiltroAtual(tipo)}
          >
            <Text style={[styles.filtroTexto, filtroAtual === tipo && styles.filtroTextoAtivo]}>
              {tipo === 'todas' ? 'Todas' : tipo === 'recebidas' ? 'Entradas' : 'Saídas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const ListFooter = () =>
    carregandoMais ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4a7df3" />
        <Text style={styles.footerText}>Carregando mais...</Text>
      </View>
    ) : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf4ff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Transações</Text>
        <View style={styles.emptySpace} />
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6b256f" />
          <Text style={styles.loadingText}>Carregando transações...</Text>
        </View>
      ) : (
        <FlatList
          data={transacoes}
          renderItem={renderTransacao}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          contentContainerStyle={styles.listaConteudo}
          refreshControl={<RefreshControl refreshing={atualizando} onRefresh={onRefresh} colors={['#6b256f']} />}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={
            <View style={styles.semTransacoes}>
              <Text style={styles.semTransacoesTexto}>Nenhuma transação encontrada</Text>
            </View>
          }
        />
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#6b256f',
      elevation: 4,
    },
    backButton: {
      padding: 5,
    },
    backButtonText: {
      fontSize: 22,
      color: '#fff',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
    },
    emptySpace: {
      width: 24,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#faf5ff',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: '#6b21a8',
    },
    listaConteudo: {
      paddingBottom: 20,
    },
    buscaContainer: {
      padding: 16,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    inputBusca: {
      backgroundColor: '#f5f3ff',
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#e9d5ff',
      marginBottom: 12,
    },
    filtros: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    filtroBotao: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      marginHorizontal: 4,
      borderRadius: 8,
      backgroundColor: '#f3e8ff',
    },
    filtroBotaoAtivo: {
      backgroundColor: '#6b256f',
    },
    filtroTexto: {
      fontSize: 14,
      color: '#7e22ce',
      fontWeight: '500',
    },
    filtroTextoAtivo: {
      color: '#fff',
    },
    transacaoItem: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginTop: 10,
      borderRadius: 14,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 6,
      elevation: 3,
    },
    transacaoIcone: {
      marginRight: 12,
      alignSelf: 'center',
    },
    iconeCirculo: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconeTexto: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    transacaoInfo: {
      flex: 1,
    },
    transacaoLinha1: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    transacaoDescricao: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4c1d95',
      flex: 1,
      marginRight: 8,
    },
    transacaoValor: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    transacaoLinha2: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    transacaoPessoa: {
      fontSize: 14,
      color: '#7e22ce',
      flex: 1,
      marginRight: 8,
    },
    transacaoData: {
      fontSize: 12,
      color: '#a78bfa',
    },
    transacaoLinha3: {
      flexDirection: 'row',
    },
    categoriaTag: {
      backgroundColor: '#ede9fe',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    categoriaTexto: {
      fontSize: 12,
      color: '#6b21a8',
      fontWeight: '500',
    },
    footerLoader: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
    },
    footerText: {
      marginLeft: 8,
      fontSize: 14,
      color: '#6b21a8',
    },
    semTransacoes: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    semTransacoesTexto: {
      fontSize: 16,
      color: '#a855f7',
      textAlign: 'center',
    },
  });
  

