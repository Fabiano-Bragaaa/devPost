import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home} from '../pages/Home';
import {Search} from '../pages/Search';
import {Profile} from '../pages/Profile';
import {NewPost} from '../pages/NewPost';
import {PostsUser} from '../pages/PostsUser';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Icon from 'react-native-vector-icons/Feather';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function AppRoutes() {
  function StackRoutes() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="NewPost"
          component={NewPost}
          options={{
            title: 'Novo Post',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#36393f',
            },
          }}
        />
        <Stack.Screen
          name="PostsUser"
          component={PostsUser}
          options={{
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#36393f',
            },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#202225',
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={StackRoutes}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon name="home" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon name="search" color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon name="user" color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
