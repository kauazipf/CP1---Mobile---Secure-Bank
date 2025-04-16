import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { handleLogin } = useAuth();

  async function submit() {
    try {
      if (!apelido || !senha) {
        Alert.alert("Erro", "Preencha todos os campos.");
        return;
      }
  
      if (senha.length < 6) {
        Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
        return;
      }
  
      await AsyncStorage.setItem("@secure-bank-apelido", apelido);
      await AsyncStorage.setItem("@secure-bank-senha", senha);
  
      handleLogin(apelido, senha);
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Erro inesperado ao tentar logar.");
    }
  }

  const router = useRouter();

  const navigateToSignUp = () => {
    router.push("/Register")
  };

  // Verificação se o dispositivo tem biometria
  useEffect(() => {
    (async () => {
     try {
      const saved = await AsyncStorage.getItem("@allow-fingerprint");
      setIsSaved(saved === "true");

      if(saved === "true") {
        const senha =  await AsyncStorage.getItem("@secure-bank-senha");
        const apelido = await AsyncStorage.getItem("@secure-bank-apelido");

        if(senha === null || apelido === null) {
          return;
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Autentique-se para continuar",
          fallbackLabel: "Usar senha",
          disableDeviceFallback: false
        });
  
        if (result.success) {
          handleLogin(apelido, senha);
        } else {
        Alert.alert("Falha na biometria.");
        return;
        }
      }

     } catch (error) {
      console.log(error)
     }
    })();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        {/* <Image
          source={require('./assets/logo.png')} // Substitua pelo caminho correto da sua logo
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text style={styles.title}>Secure Bank</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Apelido</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu usuario"
          value={apelido}
          onChangeText={setApelido}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotsenha}>
          <Text style={styles.forgotsenhaText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={submit}>
          <Text style={styles.loginButtonText}>ENTRAR</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={navigateToSignUp}
            activeOpacity={0.8}>
            <Text style={styles.signupLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6b256f',
    letterSpacing: 1.5,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '90%', 
    maxWidth: 500, 
    padding: 20,
    margin: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotsenha: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotsenhaText: {
    color: '#6b256f',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#6b256f',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#4b5563',
    fontSize: 14,
  },
  signupLink: {
    color: '#6b256f',
    fontSize: 14,
    fontWeight: 'bold',
  },
});