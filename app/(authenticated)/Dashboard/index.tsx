import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert
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

export default function DashboardScreen() {
  const [saldo, setSaldo] = useState(0);
  const [transacoes, setTransacoes] = useState<ITransacoesProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { usuario, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    carregarDashboard();
  }, [token]);

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      const saldoRes = await fetch("https://mock-bank-mock-back.yexuz7.easypanel.host/contas/saldo", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const transacoesRes = await fetch("https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const saldoData = await saldoRes.json();
      const transacoesData = await transacoesRes.json();

      setSaldo(saldoData.saldo);
      setTransacoes(transacoesData);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar os dados");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDashboard();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: ITransacoesProps }) => (
    <View style={styles.cardItem}>
      <View>
        <Text style={styles.transTitle}>{item.descricao}</Text>
        <Text style={styles.transDetails}>{item.categoria} • {item.data}</Text>
      </View>
      <Text style={[styles.transAmount, item.tipo === 'recebida' ? styles.entrada : styles.saida]}>
        {item.tipo === 'recebida' ? '+' : '-'} R$ {item.valor.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Olá, {usuario?.nome?.split(' ')[0]}</Text>
          <Text style={styles.subtitle}>Seu resumo financeiro</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/Profile")}> 
          <Text style={styles.perfilButton}>Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Saldo Atual</Text>
        {loading ? (
          <ActivityIndicator color="#6b256f" size="large" />
        ) : (
          <Text style={styles.balance}>R$ {saldo.toFixed(2)}</Text>
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.action} onPress={() => router.push("/Send")}> 
          <Text style={styles.actionText}>Enviar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={() => router.push("/Recive")}> 
          <Text style={styles.actionText}>Receber</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={() => router.push("/Transactions")}> 
          <Text style={styles.actionText}>Histórico</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6b256f',
  },
  subtitle: {
    fontSize: 14,
    color: '#7b8bb2',
  },
  perfilButton: {
    color: '#6b256f',
    fontWeight: 'bold',
    fontSize: 14,
  },
  balanceBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#7b8bb2',
    marginBottom: 4,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  action: {
    flex: 1,
    backgroundColor: '#6b256f',
    padding: 14,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 30,
  },
  cardItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  transTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e3e5c',
  },
  transDetails: {
    fontSize: 13,
    color: '#7b8bb2',
    marginTop: 2,
  },
  transAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  entrada: {
    color: '#059669',
  },
  saida: {
    color: '#dc2626',
  },
});
