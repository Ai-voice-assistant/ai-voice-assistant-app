import AccountScreen from '../screens/AccountScreen';
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import React, {useEffect, useState} from 'react';
import {TabBar} from './customBottomTab';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ManageUsers from '../screens/ManageUsersScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BottomTabScreens = () => {
  const Tab = createBottomTabNavigator();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    const user = await AsyncStorage.getItem('userDetails');
    const userDetails = JSON.parse(user);
    if (userDetails?.email === 'admin@gmail.com') {
      setIsAdmin(true);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar isAdmin={isAdmin} {...props} />}>
      <Tab.Screen name={'Home'} component={HomeScreen} />
      <Tab.Screen name={'Chat'} component={ChatScreen} />
      {isAdmin && (
        <Tab.Screen name={'Manage \nUsers'} component={ManageUsers} />
      )}
      <Tab.Screen name={'Account'} component={AccountScreen} />
    </Tab.Navigator>
  );
};
