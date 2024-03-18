import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AccountIcon from '../../assets/images/account.png';
import React, {useCallback, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import DeleteIcon from '../../assets/images/delete.png';

const ManageUserScreen = ({navigation}) => {
  const [users, setUsers] = useState({});

  useFocusEffect(
    useCallback(() => {
      getAllUser();
      return () => {};
    }, []),
  );
  const getAllUser = async () => {
    axios
      .get('http://localhost:8080/users')
      .then(res => {
        console.log(res?.data, 'all user data');
        const updatedUsers = res?.data?.filter(
          item => item?.email !== 'admin@gmail.com',
        );
        setUsers(updatedUsers);
      })
      .catch(err => {
        Alert.alert(err?.response?.data?.message);
        console.log(err, 'all user error');
      });
  };

  const deleteUser = id => {
    axios
      .delete(`http://localhost:8080/user/delete?id=${id}`)
      .then(res => {
        console.log(res?.data, 'user Deleted Success fully');
        Alert.alert('User deleted successfully!!!');
        getAllUser();
      })
      .catch(err => {
        console.log(err, 'delete user error');
        Alert.alert(err?.response?.data?.message);
      });
  };

  const handleDeleteUser = id => {
    Alert.alert('Are you sure?', 'Delete the user', [
      {
        text: 'Yes',
        onPress: () => {
          deleteUser(id);
        },
        style: 'destructive',
      },
      {
        text: 'No',
        style: 'default',
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#e4fff6]">
      <Text className="text-center text-2xl font-semibold mt-4">
        Manage User Profiles
      </Text>
      <FlatList
        data={users}
        renderItem={({item}) => (
          <View className="flex flex-row items-center mx-4 mt-8 bg-white p-4 shadow-md rounded-2xl">
            <Image source={AccountIcon} className="h-12 w-12 mr-4" />
            <View className="space-y-1 flex flex-1">
              <Text className="text-xl font-semibold">{`Name: ${item?.name}`}</Text>
              <Text className="text-base font-medium flex flex-1">
                {`Email: ${item?.email}`}
              </Text>
              <Text className="text-base font-medium">
                {`Active: ${item?.active}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleDeleteUser(item?.id);
              }}>
              <Image source={DeleteIcon} className="h-10 w-10" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ManageUserScreen;
