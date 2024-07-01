import React, {useLayoutEffect, useState, useCallback, useContext} from 'react';
import {Container, ListPost} from './styles';

import firestore from '@react-native-firebase/firestore';

import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import {PostsLists} from '../../components/PostsLists';
import {ActivityIndicator, View} from 'react-native';
import {AuthContext} from '../../contexts/auth';

export function PostsUser() {
  const {user} = useContext(AuthContext);

  const route = useRoute();
  const navigation = useNavigation();

  const [title, setTitle] = useState(route.params?.title);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title === '' ? '' : title,
    });
  }, [navigation, title]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      firestore()
        .collection('post')
        .where('userId', '==', route.params?.userId)
        .orderBy('created', 'desc')
        .get()
        .then(snapshot => {
          const postList = [];
          snapshot.docs.map(u => {
            postList.push({
              ...u.data(),
              id: u.id,
            });
          });

          if (isActive) {
            setPosts(postList);
            setLoading(false);
          }
        });

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <Container>
      {loading ? (
        <View
          style={{flex: 1, justifyContent: 'center', alignItems: 'center '}}>
          <ActivityIndicator size={50} color={'#e52246'} />
        </View>
      ) : (
        <ListPost
          data={posts}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <PostsLists data={item} userId={user.uid} />}
        />
      )}
    </Container>
  );
}
