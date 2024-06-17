import {StatusBar} from 'react-native';

import {Routes} from './src/routes';

import {NavigationContainer} from '@react-navigation/native';

import {AuthProvider} from './src/contexts/auth';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor="#36393f" barStyle="light-content" />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
