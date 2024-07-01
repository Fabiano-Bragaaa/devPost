import React, {useState} from 'react';
import {
  Container,
  Name,
  Header,
  Avatar,
  ContentView,
  Content,
  Action,
  LikeButton,
  Like,
  TimePost,
} from './styles';

import {formatDistance} from 'date-fns';
import {ptBR} from 'date-fns/locale';

import firestore from '@react-native-firebase/firestore';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useNavigation} from '@react-navigation/native';

export function PostsLists({data, userId}) {
  const navigation = useNavigation();
  const [likesPost, setLikesPost] = useState(data?.likes);

  async function handleLikePost(id, likes) {
    const docId = `${userId}_${id}`;

    const doc = await firestore().collection('likes').doc(docId).get();

    if (doc.exists) {
      //aq eu diminuo lá no post um like
      await firestore()
        .collection('post')
        .doc(id)
        .update({
          likes: likes - 1,
        })
        .catch(err => {
          console.log('erro ao apagar', err);
        });

      //aq eu deleto o like
      await firestore()
        .collection('likes')
        .doc(docId)
        .delete()
        .then(() => {
          setLikesPost(likes - 1);
        })
        .catch(err => {
          console.log('erro ao tirao o like', err);
        });

      return;
    }

    //aq eu crio a coleção like

    await firestore()
      .collection('likes')
      .doc(docId)
      .set({
        userId: userId,
        postId: id,
      })
      .catch(err => {
        console.log('erro ao enviar os dados', err);
      });

    //aq eu adiciono o like no post e adiciono a propriedade post

    await firestore()
      .collection('post')
      .doc(id)
      .update({
        likes: likes + 1,
      })
      .then(() => {
        setLikesPost(likes + 1);
      })
      .catch(err => {
        console.log('erro ao adicionar o like', err);
      });
  }

  function formatTimePost() {
    const datePost = new Date(data.created.seconds * 1000);

    return formatDistance(new Date(), datePost, {
      locale: ptBR,
    });
  }

  return (
    <Container>
      <Header
        onPress={() =>
          navigation.navigate('PostsUser', {
            title: data.autor,
            userId: data.userId,
          })
        }>
        {data.avatarUrl ? (
          <Avatar source={{uri: data.avatarUrl}} />
        ) : (
          <Avatar source={require('../../assets/avatar.png')} />
        )}

        <Name numberOfLines={1}>{data?.autor}</Name>
      </Header>

      <ContentView>
        <Content>{data?.content}</Content>
      </ContentView>

      <Action>
        <LikeButton onPress={() => handleLikePost(data.id, likesPost)}>
          <Like>{likesPost === 0 ? '' : likesPost}</Like>
          <Icon
            name={likesPost === 0 ? 'heart-plus-outline' : 'cards-heart'}
            size={20}
            color={'#e52542'}
          />
        </LikeButton>

        <TimePost>{formatTimePost()}</TimePost>
      </Action>
    </Container>
  );
}
