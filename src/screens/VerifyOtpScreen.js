import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import OtpInputs from 'react-native-otp-inputs';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const VerifyOtpScreen = ({route}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const {email} = route?.params;
  const navigation = useNavigation();

  const handleOTPChange = otp => {
    setOtp(otp);
  };

  const handleVerifyOtp =()=>{
    setLoading(true)
    console.log(otp,email)
    axios
    .post('http://localhost:8080/verify', {
      otp,
      email,
    })
    .then(res => {
      setLoading(false)
      console.log(res?.data, 'verify response');
      if(res?.data?.success){
        Alert.alert('OTP Verified Successfully!!!', '', [
          {
            text: 'OK',
            onPress: () => {
              AsyncStorage.setItem('userDetails', JSON.stringify(res?.data?.data));
              navigation.replace('HomeScreen');
            },
            style: 'cancel',
          },
        ]);
      } else {
        Alert.alert('Invalid OTP')
      }
     
    })
    .catch(err => {
      setLoading(false)
      console.log(err, 'verify err');
      Alert.alert(err?.response?.data?.message)
    });
  }

  return loading ? (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator color={'#059669'} size={'large'}/>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verification</Text>
      <View style={{padding: 25, marginLeft: 35}}>
        <Image
          source={require('../../assets/images/verification.png')}
          resizeMode="contain"
          style={{height: 250, width: 250, marginVertical: 20}}
        />
      </View>
      <Text style={styles.otpTitle}>OTP Sent to</Text>
      <Text style={styles.title}>{email?.toLowerCase()}</Text>
      <OtpInputs
        numberOfInputs={4}
        handleChange={handleOTPChange}
        inputStyles={styles.input}
        selectionColor={'#059669'}
        autofillFromClipboard={false}
        style={styles.inputContainer}
      />
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          {
            backgroundColor: otp?.length !== 4 ? 'gray' : '#059669',
            opacity: otp?.length !== 4 ? 0.6 : 1,
          },
        ]}
        disabled={otp?.length !== 4}
        onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
      <Text style={styles.terms}>
        {'By signing up, you agree with our Terms \nand conditions'}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e4fff6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  otpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray',
  },
  terms: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  input: {
    width: 65,
    height: 45,
    borderColor: '#059669',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#F5F5F6',
  },
  buttonContainer: {
    width: '85%',
    backgroundColor: '#059669',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default VerifyOtpScreen;
