import React, { useCallback, useRef } from 'react';
// KeyboardAvoidingView diminui o tamanho da tela para que o teclado não fique por cima
// Platform verifica qual o SO do celular
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './styles';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const handleSignIn = useCallback((data: object) => {
    console.log(data);
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled" // se o usuário clicar na tela, o teclado vai sumir ou não, depende do comportamento padrão de cada SO
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu logon</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next" // altera o texto que fica no botão do canto inferior direito
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus(); // troca o foco para o input de senha
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry // campo de senha (insere bolinhas)
                returnKeyType="send" // altera o texto que fica no botão do canto inferior direito
                onSubmitEditing={() => {
                  formRef.current?.submitForm(); // função disparada quando o usuário clica no botão configurado acima (returnKeyType="send")
                }}
              />
            </Form>
            <Button
              onPress={() => formRef.current?.submitForm()} // ? porque formRef pode estar nulo
            >
              Entrar
            </Button>

            <ForgotPassword onPress={() => { }}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};
export default SignIn;
