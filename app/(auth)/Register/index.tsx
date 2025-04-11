import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';

export default function Register() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  const router = useRouter();

  // Função para formatar o CPF enquanto digita
  const formatarCPF = (texto: string) => {
    // Remove todos os caracteres não numéricos
    const numeros = texto.replace(/\D/g, '');

    // Aplica a máscara de CPF (XXX.XXX.XXX-XX)
    let cpfFormatado = numeros;
    if (numeros.length > 3) {
      cpfFormatado = numeros.substring(0, 3) + '.' + numeros.substring(3);
    }
    if (numeros.length > 6) {
      cpfFormatado = cpfFormatado.substring(0, 7) + '.' + numeros.substring(6);
    }
    if (numeros.length > 9) {
      cpfFormatado = cpfFormatado.substring(0, 11) + '-' + numeros.substring(9, 11);
    }

    // Limita a 14 caracteres (XXX.XXX.XXX-XX)
    cpfFormatado = cpfFormatado.substring(0, 14);

    setCpf(cpfFormatado);
  };

  // Validação e envio do formulário
  const handleCadastro = async () => {
   try {
     // Validação básica dos campos
     if (!nome || !cpf || !apelido || !senha || !confirmaSenha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    // Validação de CPF (formato básico)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      Alert.alert('Erro', 'CPF inválido. Use o formato: 123.456.789-00');
      return;
    }

    // Validação de senha
    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Confirmar senha
    if (senha !== confirmaSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // Criar objeto com os dados do usuário
    const userData = {
      nome,
      cpf,
      apelido,
      senha
    };

    const response = await
      fetch("https://mock-bank-mock-back.yexuz7.easypanel.host/contas", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(userData)
      });
      
    if (!response.ok) {
      const dataError = await response.json();

      throw new Error(dataError?.message || 'Erro desconhecido na API');

    }

    Alert.alert(
      'Cadastro realizado',
      `Usuário ${apelido} cadastrado com sucesso!`,
      [
        {
          text: 'OK',
          onPress: () => {
            router.push("/Login")
          }
        }
      ]
    );
  } catch (error: any) {
    Alert.alert('Erro', error?.message || 'Ocorreu um erro inesperado');
  }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              placeholder="123.456.789-00"
              value={cpf}
              onChangeText={formatarCPF}
              keyboardType="numeric"
              maxLength={14}
            />

            <Text style={styles.label}>Apelido</Text>
            <TextInput
              style={styles.input}
              placeholder="Como quer ser chamado"
              value={apelido}
              onChangeText={setApelido}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo de 6 caracteres"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a senha novamente"
              value={confirmaSenha}
              onChangeText={setConfirmaSenha}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
              <Text style={styles.buttonText}>CADASTRAR</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center', // centraliza textos
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6b256f',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7b8bb2',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: 600, // menor largura para responsividade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#6b256f',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6b256f',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#6b256f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#7b8bb2',
    fontSize: 14,
  },
  loginLink: {
    color: '#6b256f',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

