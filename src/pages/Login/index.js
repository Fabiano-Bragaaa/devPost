import React, {useState, useContext} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

import {
  Container,
  Title,
  Input,
  Button,
  ButtonText,
  SignUpButton,
  SignUpText,
} from './styles';
import {AuthContext} from '../../contexts/auth';

import Icon from 'react-native-vector-icons/MaterialIcons';

export function Login() {
  const [login, setLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passowrd, setPassword] = useState('');

  const {signUp, signIn, loadingAuth} = useContext(AuthContext);

  function toggleLogin() {
    setLogin(!login);
    setEmail('');
    setPassword('');
    setName('');
  }

  async function handleSignIn() {
    if (email === '' || passowrd === '') {
      console.log('preencha todos os campos');
      return;
    }

    await signIn(email, passowrd);
  }

  async function handleSignUp() {
    if (email === '' || passowrd === '' || name === '') {
      console.log('preencha todos os campos');
      return;
    }

    await signUp(email, passowrd, name);
  }

  if (login) {
    return (
      <Container>
        <Title>
          Dev<Text style={{color: '#e52246'}}>Post</Text>
        </Title>

        <Input
          placeholder="seuEmail@teste.com"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          placeholder="*********"
          value={passowrd}
          onChangeText={setPassword}
        />

        <Button onPress={handleSignIn}>
          {loadingAuth ? (
            <ActivityIndicator size={20} color="#fff" />
          ) : (
            <ButtonText>Acessar</ButtonText>
          )}
        </Button>

        <SignUpButton onPress={toggleLogin}>
          <SignUpText>Criar uma conta</SignUpText>
        </SignUpButton>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        Dev<Text style={{color: '#e52246'}}>Post</Text>
      </Title>

      <Input placeholder="Seu nome" value={name} onChangeText={setName} />

      <Input
        placeholder="seuEmail@teste.com"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="*********"
        value={passowrd}
        onChangeText={setPassword}
      />

      <Button onPress={handleSignUp}>
        {loadingAuth ? (
          <ActivityIndicator size={20} color="#fff" />
        ) : (
          <ButtonText>Cadastrar</ButtonText>
        )}
      </Button>

      <SignUpButton onPress={toggleLogin}>
        <SignUpText>Já possuo uma conta</SignUpText>
      </SignUpButton>
    </Container>
  );
}