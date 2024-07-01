import React, {useEffect, useState} from 'react';
import {Container, AreaInput, Input, List} from './styles';

import Icon from 'react-native-vector-icons/Feather';

import firestore from '@react-native-firebase/firestore';
import {SearchList} from '../../components/SearchList';

export function Search() {
  const [input, setInput] = useState('');
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (input === '' || input === undefined) {
      setUser([]);
      return;
    }

    const subscriber = firestore()
      .collection('users')
      .where('nome', '>=', input)
      .where('nome', '<=', input + '\uf8ff')
      .onSnapshot(snapshot => {
        const listUsers = [];

        snapshot.forEach(doc => {
          listUsers.push({
            ...doc.data(),
            id: doc.id,
          });
        });

        setUser(listUsers);
      });

    return () => subscriber();
  }, [input]);

  return (
    <Container>
      <AreaInput>
        <Icon name="search" size={20} color={'#e52246'} />
        <Input
          placeholder="Procurando alguem?"
          value={input}
          onChangeText={setInput}
          placeholderTextColor={'#353840'}
        />
      </AreaInput>
      <List data={user} renderItem={({item}) => <SearchList data={item} />} />
    </Container>
  );
}
