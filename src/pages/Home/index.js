import React, {useState, useContext, useCallback} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';

import {Container, ButtonPost, ListPost} from './styles';

import Icon from 'react-native-vector-icons/Feather';

import firestore from '@react-native-firebase/firestore';

import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Header} from '../../components/Header';
import {AuthContext} from '../../contexts/auth';
import {PostsLists} from '../../components/PostsLists';

export function Home() {
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);
  const [post, setPost] = useState([]);

  const [loadingRefreash, setLoadingRefreash] = useState(false);
  const [lastItem, setLastItem] = useState('');
  const [emptyList, setEmptyList] = useState(false);

  const [loading, setLoading] = useState(true);

  function handleRefreshingLoading() {
    setLoadingRefreash(true);

    firestore()
      .collection('post')
      .orderBy('created', 'desc')
      .limit(5)
      .get()
      .then(snapshot => {
        setPost([]);
        const postsLists = [];

        snapshot.docs.map(u => {
          postsLists.push({
            ...u.data(),
            id: u.id,
          });
        });

        setEmptyList(false);
        setPost(postsLists);
        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
        setLoading(false);
      });

    setLoadingRefreash(false);
  }

  async function getListPosts() {
    if (emptyList) {
      setLoading(false);
      return null;
    }

    if (loading) {
      return;
    }

    firestore()
      .collection('post')
      .orderBy('created', 'desc')
      .limit(5)
      .startAfter(lastItem)
      .get()
      .then(snapshot => {
        const listPost = [];

        snapshot.docs.map(u => {
          listPost.push({
            ...u.data(),
            id: u.id,
          });
        });

        setEmptyList(!!snapshot.empty);
        setLastItem(snapshot.docs[snapshot.docs.length - 1]);
        setPost(oldPost => [...oldPost, ...listPost]);
        setLoading(false);
      });
  }

  useFocusEffect(
    useCallback(() => {
      console.log(user);
      let isActive = true;

      function fetchPosts() {
        firestore()
          .collection('post')
          .orderBy('created', 'desc')
          .limit(5)
          .get()
          .then(snapshot => {
            if (isActive) {
              setPost([]);
              const postsLists = [];

              snapshot.docs.map(u => {
                postsLists.push({
                  ...u.data(),
                  id: u.id,
                });
              });

              setEmptyList(!!snapshot.empty);
              setPost(postsLists);
              setLastItem(snapshot.docs[snapshot.docs.length - 1]);
              setLoading(false);
            }
          });
      }

      fetchPosts();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <Container>
      <Header />

      {loading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={50} color={'#e52246'} />
        </View>
      ) : (
        <ListPost
          data={post}
          renderItem={({item}) => <PostsLists data={item} userId={user.uid} />}
          showsVerticalScrollIndicator={false}
          refreshing={loadingRefreash}
          onRefresh={handleRefreshingLoading}
          onEndReached={() => getListPosts()}
          onEndReachedThreshold={0.1}
        />
      )}

      <ButtonPost
        activeOpacity={0.8}
        onPress={() => navigation.navigate('NewPost')}>
        <Icon name="edit-2" color="#fff" size={25} />
      </ButtonPost>
    </Container>
  );
}
