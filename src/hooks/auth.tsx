import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// <AuthContext.Provider> indica que todo componente dentro dele
// terá acesso à informação de autenticação

export const AuthProvider: React.FC = ({ children }) => {
  // estado para pegar o token e o usuário
  const [data, setData] = useState<AuthState>({} as AuthState);
  // loading será usado para evitar o problema da tela de login aparecer rapidamente, mesmo após o usuário já estar logado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      // se existir token e user, data será preenchida
      // posição 1 guarda o valor
      // posição 0 guarda a chave
      if (token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1]) });
      }
      // independentemente de encontrar o usuário ou não loading será false
      setLoading(false);
    }
    loadStoragedData();
  }, []);
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);
    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:user', '@GoBarber:token']);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  // se o desenvolvedor não colocar o AuthProvider por volta do app (SignIn, por exemplo)
  // vai disparar um erro porque o contexto não vai existir
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
