import * as React from 'react';

import {Text, View} from 'react-native';

import {BottomTabScreens} from './primary-stack';
import HomeScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import SignupScreen from '../screens/SignUpScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function Navigation() {
  const [userDetails, setUserDetails] = React.useState();

  const init = async () => {
    const user = await AsyncStorage.getItem('userDetails');
    console.log(user,"userrrr")
    setUserDetails(JSON.parse(user));
  };
  return (
    <NavigationContainer 
      onReady={init}
      fallback={<Text>Loading...</Text>}
    >
      {userDetails ? (
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="HomeScreen">
          <Stack.Screen name="HomeScreen" component={BottomTabScreens} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
          <Stack.Screen name="HomeScreen" component={BottomTabScreens} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default Navigation;
