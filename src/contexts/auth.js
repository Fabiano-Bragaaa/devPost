import React, {useState, createContext, useEffect} from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadingStorage() {
      const storageUser = await AsyncStorage.getItem('@devApp');

      if (storageUser) {
        setUser(JSON.parse(storageUser));

        setLoading(false);
      }

      setLoading(false);
    }

    loadingStorage();
  }, []);

  async function signUp(email, passoword, name) {
    setLoadingAuth(true);
    await auth()
      .createUserWithEmailAndPassword(email, passoword)
      .then(async value => {
        let uid = value.user.uid;
        await firestore()
          .collection('users')
          .doc(uid)
          .set({
            nome: name,
            createdAt: new Date(),
          })
          .then(() => {
            let data = {
              uid: uid,
              nome: name,
              email: value.user.email,
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
          });
      })
      .catch(err => {
        console.log(err);
        setLoadingAuth(false);
      });
  }

  async function signIn(email, passoword) {
    setLoadingAuth(true);
    await auth()
      .signInWithEmailAndPassword(email, passoword)
      .then(async value => {
        let uid = value.user.uid;

        const userProfile = await firestore()
          .collection('users')
          .doc(uid)
          .get();

        let data = {
          uid: uid,
          nome: userProfile.data().nome,
          email: value.user.email,
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
      })

      .catch(error => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  async function signOut() {
    await auth().signOut();
    await AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  async function storageUser(data) {
    await AsyncStorage.setItem('@devApp', JSON.stringify(data));
  }

  return (
    <AuthContext.Provider
      value={{signed: !!user, signUp, signIn, loadingAuth, loading, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}
