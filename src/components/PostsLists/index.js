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
import {firebase} from '@react-native-firebase/auth';

export function PostsLists({data, userId}) {
  const [likesPost, setLikesPost] = useState(data?.likes);

  async function handleLikePost(id, likes) {
    console.log(id);
    console.log(likes);
    console.log(userId);
    const docId = `${userId}_${id}`;

    const doc = await firestore().collection('likes').doc(docId).get();

    if (doc.exists) {
      await firestore()
        .collection('post')
        .doc(id)
        .update({
          likes: likes - 1,
        })
        .catch(err => {
          console.log('erro ao apagar', err);
        });

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
      <Header>
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
