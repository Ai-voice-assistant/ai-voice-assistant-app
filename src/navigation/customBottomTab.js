import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import ChatFilledIcon from '../../assets/images/chat-filled.png';
import ChatIcon from '../../assets/images/chat.png';
import HomeFilledIcon from '../../assets/images/home-filled.png';
import HomeIcon from '../../assets/images/home.png';
import React from 'react';
import UserFilledIcon from '../../assets/images/user-filled.png';
import UserIcon from '../../assets/images/user.png';
import ManageProfile from '../../assets/images/manage-profile.png';
import ManageProfileFilled from '../../assets/images/manage-profile-filled.png';

export const TabBar = ({state, navigation, isAdmin}) => {
  const tabBarHeight = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: tabBarHeight.value}],
    alignItems: 'center',
  }));

  return (
    <SafeAreaView style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const selected = state.index === index;
        let icon;
        switch (route.name) {
          case 'Home':
            icon = selected ? HomeFilledIcon : HomeIcon;
            break;
          case 'Chat':
            icon = selected ? ChatFilledIcon : ChatIcon;
            break;
          case 'Account':
            icon = selected ? UserFilledIcon : UserIcon;
            break;
          case 'Manage \nUsers':
            icon = selected ? ManageProfileFilled : ManageProfile;
            break;
          default:
            icon = HomeIcon;
            break;
        }
        return (
          <TouchableOpacity
            style={
              selected
                ? isAdmin
                  ? styles.adminSelectedTabContainer
                  : styles.selectedTabContainer
                : styles.tabContainer
            }
            onPress={() => {
              navigation.navigate(route.name);
            }}
            key={index}>
            <Animated.View style={animatedStyle}>
              <Image resizeMode="center" source={icon} style={styles.image} />

              {!selected && (
                <Text style={styles.tabItemText}>
                  {route?.name +
                    (route?.name !== 'Manage \nUsers' ? '\n' : '')}
                </Text>
              )}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 20,
    width: '90%',
    borderRadius: 20,
    alignSelf: 'center',
  },
  selectedTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 50,
    padding: 24,
    top: -15,
  },
  adminSelectedTabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 50,
    padding: 20,
    paddingHorizontal: 24,
    top: -15,
  },
  tabContainer: {alignItems: 'center', justifyContent: 'center', marginTop: 10},
  tabItemText: {
    color: '#059669',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  image: {height: 28, width: 28},
});
