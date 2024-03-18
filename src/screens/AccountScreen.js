import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import AccountIcon from '../../assets/images/account.png';
import React, {useCallback, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const AccountScreen = ({navigation}) => {
  const [userDetails, setUserDetails] = useState({});

  useFocusEffect(
    useCallback(() => {
      init();
      return () => {};
    }, []),
  );
  const init = async () => {
    const user = await AsyncStorage.getItem('userDetails');
    setUserDetails(JSON.parse(user));
  };
  return (
    <SafeAreaView className="flex-1 bg-[#e4fff6]">
      <Text className="text-center text-2xl font-semibold mt-4">
        My Profile
      </Text>
      <View className="flex flex-row items-center mx-6 mt-8">
        <Image source={AccountIcon} className="h-12 w-12 mr-4" />
        <View className="space-y-1">
          <Text className="text-xl font-semibold">{userDetails?.name}</Text>
          <Text className="text-base font-medium text-gray-500">
            {userDetails?.email}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="p-3 absolute bottom-36 w-[90%] self-center rounded-xl"
        onPress={() => {
          AsyncStorage.removeItem('userDetails')
          navigation?.replace('Login');
        }}>
        <Text className="text-[#059669] text-center text-2xl font-semibold">
          Sign out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountScreen;
