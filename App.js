import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './src/screens/HomeScreen';
import BuyScreen from './src/screens/BuyScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#6200ee" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Buy" component={BuyScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </GestureHandlerRootView>
  );
}
