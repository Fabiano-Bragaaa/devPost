import React, {useState, useLayoutEffect, useContext} from 'react';

import {useNavigation} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {AuthContext} from '../../contexts/auth';

import {Container, Button, ButtonText, Input} from './styles';

export function NewPost() {
  const navigation = useNavigation();

  const {user} = useContext(AuthContext);

  const [post, setPost] = useState('');

  useLayoutEffect(() => {
    const option = navigation.setOptions({
      headerRight: () => (
        <Button onPress={handlePost}>
          <ButtonText>Compartilhar</ButtonText>
        </Button>
      ),
    });
  }, [navigation, post]);

  async function handlePost() {
    if (post === '') {
      console.log('post n tem conteudo');
      return;
    }

    let avatarUrl = null;

    try {
      let response = await storage()
        .ref('users')
        .child(user?.uid)
        .getDownloadURL();

      avatarUrl = response;
    } catch (err) {
      avatarUrl = null;
    }

    await firestore()
      .collection('post')
      .add({
        created: new Date(),
        content: post,
        autor: user?.nome,
        userId: user?.uid,
        likes: 0,
        avatarUrl,
      })
      .then(() => {
        setPost('');
        console.log('post cadastrado com sucesso');
      })
      .catch(error => {
        console.log('erro ao postar: ', error);
      });

    navigation.navigate('Home');
  }

  return (
    <Container>
      <Input
        placeholder="O que está acontecendo?"
        value={post}
        onChangeText={setPost}
        autoCorrect={false}
        multiline
        placeholderTextColor={'#ddd'}
        maxLength={300}
      />
    </Container>
  );
}
