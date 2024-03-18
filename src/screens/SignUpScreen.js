import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleRegister = () => {
    setLoading(true)
      axios
        .post('http://localhost:8080/signup', {
          name,
          email: email?.toLowerCase(),
          password,
        })
        .then(res => {
          setLoading(false)
          console.log(res?.data, 'sign up response');
          setName('');
          setEmail('');
          setPassword('');
          navigation.navigate('VerifyOtp', {email: email?.toLowerCase()});
        })
        .catch(err => {
          setLoading(false)
          console.log(err?.response?.data, 'sign up err');
          if (err?.response?.data?.message === "Email already exist") {
            Alert.alert(err?.response?.data?.message,'',[
               {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('Login');
                },
                style: 'cancel',
              },
            ]);
          } else {
            Alert.alert(err?.response?.data?.message);
          }
        });

      console.log('Register:', {email, password});
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  };

  const validatePassword = password => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    setIsValidPassword(passwordRegex.test(password));
  };

  return loading ? (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator color={'#059669'} size={'large'}/>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Image
        source={require('../../assets/images/bot.png')}
        style={styles.image}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={text => {
            setName(text);
          }}
          selectionColor={'#059669'}
          style={styles.textInputStyle}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => {
            setEmail(text);
            validateEmail(text);
          }}
          selectionColor={'#059669'}
          style={[styles.textInputStyle, {marginBottom: isValidEmail ? 20 : 5}]}
        />
        {!isValidEmail && (
          <Text style={styles.errorText}>Please enter valid email</Text>
        )}
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => {
            setPassword(text);
            validatePassword(text);
          }}
          selectionColor={'#059669'}
          secureTextEntry={!show}
          style={[
            styles.textInputStyle,
            {marginBottom: isValidPassword ? 20 : 5},
          ]}
        />
        <TouchableOpacity
          style={[styles.passConatiner, {bottom: isValidPassword ? 30 : 48}]}
          onPress={() => {
            setShow(!show);
          }}>
          <Image
            source={
              show
                ? require('../../assets/images/show-password.png')
                : require('../../assets/images/hide-password.png')
            }
            style={styles.passImg}
          />
        </TouchableOpacity>
        {!isValidPassword && (
          <Text style={styles.errorText}>Please enter valid password</Text>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          {
            backgroundColor:
              name && email && password && isValidEmail && isValidPassword
                ? '#059669'
                : 'gray',
            opacity:
              name && email && password && isValidEmail && isValidPassword
                ? 1
                : 0.6,
          },
        ]}
        disabled={!email || !password || !isValidEmail || !isValidPassword}
        onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.terms}>
        Don't have an account?
        <Text
          style={styles.signupText}
          onPress={() => navigation.navigate('Login')}>
          {' Sign In'}
        </Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#e4fff6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {height: 250, width: 250, marginVertical: 20},
  passImg: {height: 25, width: 25},
  passConatiner: {
    position: 'absolute',
    right: 20,
  },
  terms: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  signupText: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    marginTop: 10,
  },
  inputContainer: {
    width: '85%',
    marginTop: 40,
  },
  textInputStyle: {
    backgroundColor: '#F5F5F6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#059669',
    marginBottom: 20,
    padding: 15,
  },
  errorText: {color: 'red', marginHorizontal: 10, marginBottom: 15},
  buttonContainer: {
    width: '85%',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 16,
    marginVertical: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignupScreen;
