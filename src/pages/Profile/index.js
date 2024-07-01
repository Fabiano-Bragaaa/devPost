import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../../contexts/auth';
import {Modal, Platform} from 'react-native';

import {Header} from '../../components/Header';
import {
  Container,
  Name,
  Email,
  Button,
  ButtonText,
  UploadButton,
  UploadText,
  Avatar,
  ModalContainer,
  ButtonBack,
  Input,
} from './styles';

import Icon from 'react-native-vector-icons/Feather';

import {launchImageLibrary} from 'react-native-image-picker';

import firestore from '@react-native-firebase/firestore';

import storage from '@react-native-firebase/storage';
import {addISOWeekYears} from 'date-fns';

export function Profile() {
  const {signOut, user, setUser, storageUser} = useContext(AuthContext);

  const [nome, setNome] = useState(user?.nome);
  const [url, setUrl] = useState(null);
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
  }

  //atualizar o nome do perfil
  async function updateProfile() {
    if (nome === '') {
      return;
    }

    await firestore().collection('users').doc(user?.uid).update({
      nome: nome,
    });

    //buscar todos os posts desse user e depois atualizar eles

    const postsDocs = await firestore()
      .collection('post')
      .where('userId', '==', user?.uid)
      .get();

    //pecorrer todos os posts e atualizar

    postsDocs.forEach(async doc => {
      await firestore().collection('post').doc(doc.id).update({
        autor: nome,
      });
    });

    let data = {
      uid: user.uid,
      nome: nome,
      email: user.email,
    };

    setUser(data);
    storageUser(data);
    setOpen(false);
  }

  function uploadFile() {
    const options = {
      noData: true,
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('cancelou');
      } else if (response.error) {
        console.log('error');
      } else {
        //aq é subir pro firebase
        uploadFileFirebase(response).then(() => {
          uploadAvatarPosts();
        });

        setUrl(response.assets[0].uri);
        console.log(url);
      }
    });
  }

  async function uploadFileFirebase(response) {
    const fileSource = response.assets[0].uri;
    console.log(fileSource);

    const storageRef = storage().ref('users').child(user?.uid);

    return await storageRef.putFile(fileSource);
  }

  async function uploadAvatarPosts() {
    const storageRef = storage().ref('users').child(user?.uid);
    const url = await storageRef
      .getDownloadURL()
      .then(async image => {
        //atualzar todos os posts desse user
        const postsDocs = await firestore()
          .collection('post')
          .where('userId', '==', user.uid)
          .get();

        //agora vou percorrer todos os posts e trocar a url da imagem

        postsDocs.forEach(async doc => {
          await firestore().collection('post').doc(doc.id).update({
            avatarUrl: image,
          });
        });
      })
      .catch(err => {
        console.log('error ao atualizar a foto', err);
      });
  }

  useEffect(() => {
    let isActive = true;
    async function loadingAvatar() {
      try {
        if (isActive) {
          let response = await storage()
            .ref('users')
            .child(user?.uid)
            .getDownloadURL();
          setUrl(response);
        }
      } catch {
        console.log('não encontramos nenhuma foto');
      }
    }

    loadingAvatar();

    return () => (isActive = false);
  }, []);

  return (
    <Container>
      <Header />

      {url ? (
        <UploadButton onPress={() => uploadFile()}>
          <UploadText> + </UploadText>
          <Avatar source={{uri: url}} />
        </UploadButton>
      ) : (
        <UploadButton onPress={() => uploadFile()}>
          <UploadText> + </UploadText>
        </UploadButton>
      )}

      <Name>{user?.nome}</Name>
      <Email>{user?.email}</Email>

      <Button bg="#428cfd" onPress={() => setOpen(true)}>
        <ButtonText color="#fff">Atualizar perfil</ButtonText>
      </Button>
      <Button bg="#ddd" onPress={handleSignOut}>
        <ButtonText color="#353840">Sair</ButtonText>
      </Button>

      <Modal visible={open} animationType="slide" transparent>
        <ModalContainer behavior={Platform.OS === 'android' ? '' : 'padding'}>
          <ButtonBack onPress={() => setOpen(false)}>
            <Icon name="arrow-left" size={22} color={'#121212'} />
            <ButtonText color={'#121212'}>Voltar</ButtonText>
          </ButtonBack>

          <Input placeholder={user?.nome} value={nome} onChangeText={setNome} />

          <Button bg="#428cfd" onPress={updateProfile}>
            <ButtonText color="#fff">Salvar</ButtonText>
          </Button>
        </ModalContainer>
      </Modal>
    </Container>
  );
}
