import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import ChatMessageIcon from '../../assets/images/chat_message.png';
import Features from '../components/features';
import LoadingIcon from '../../assets/images/loading.gif';
import RecordingIcon from '../../assets/images/recordingIcon.png';
import SendIcon from '../../assets/images/send.png';
import Tts from 'react-native-tts';
import Voice from '@react-native-community/voice';
import VoiceIcon from '../../assets/images/voice.png';
import VoiceLoadingIcon from '../../assets/images/voiceLoading.gif';
import {apiCall} from '../api/openAI';

const ChatScreen = () => {
  const [result, setResult] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [chat, setChat] = useState(false);
  const scrollViewRef = useRef();

  const speechStartHandler = e => {
    console.log('speech start event', e);
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('speech stop event', e);
  };
  const speechResultsHandler = e => {
    console.log('speech event: ', e);
    const text = e.value[0];
    setResult(text);
  };

  const speechErrorHandler = e => {
    console.log('speech error: ', e);
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      await Voice.start('en-GB'); // en-US
    } catch (error) {
      console.log('error', error);
    }
  };
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      fetchResponse();
    } catch (error) {
      console.log('error', error);
    }
  };
  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
  };

  const fetchResponse = async () => {
    if (result.trim().length > 0) {
      setLoading(true);
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);

      // scroll to the bottom of the view
      updateScrollView();

      // fetching response from chatGPT with our prompt and old messages
      apiCall(result.trim(), newMessages).then(res => {
        console.log('got api data');
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          setResult('');
          updateScrollView();

          // now play the response to user
          startTextToSpeach(res.data[res.data.length - 1]);
        } else {
          setResult('');
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({animated: true});
    }, 200);
  };

  const startTextToSpeach = message => {
    if (!message.content.includes('https')) {
      setSpeaking(true);
      // playing response with the voice id and voice speed
      Tts.speak(message.content, {
        iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
        rate: 0.5,
      });
    }
  };

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  useEffect(() => {
    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    // text to speech events
    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => {
      console.log('finish', event);
      setSpeaking(false);
    });
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    return () => {
      // destroy the voice instance after component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View className="flex-1 bg-[#e4fff6]">
      {/* <StatusBar barStyle="dark-content" /> */}
      <SafeAreaView className="flex-1 flex mt-5">
        {/* bot icon */}
        {/* <View className="flex-row justify-center">
          <Image
            source={require('../../assets/images/bot.png')}
            style={{height: hp(15), width: hp(15)}}
          />
        </View> */}

        {/* features || message history */}
        {messages.length > 0 ? (
          <View className="space-y-2 flex-1">
            <View style={{height: hp(58)}} className=" flex flex-1 px-4 mb-2">
              <ScrollView
                ref={scrollViewRef}
                bounces={false}
                className="space-y-4 flex flex-1"
                showsVerticalScrollIndicator={false}>
                {messages.map((message, index) => {
                  if (message.role === 'assistant') {
                    if (message.content.includes('https')) {
                      // result is an ai image
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                            <Image
                              source={{uri: message.content}}
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{height: wp(60), width: wp(60)}}
                            />
                          </View>
                        </View>
                      );
                    } else {
                      // chat gpt response
                      return (
                        <View
                          key={index}
                          style={{width: wp(70)}}
                          className="bg-emerald-100 p-2 rounded-xl rounded-tl-none">
                          <Text
                            className="text-neutral-800"
                            style={{fontSize: wp(4)}}>
                            {message.content}
                          </Text>
                        </View>
                      );
                    }
                  } else {
                    // user input text
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{width: wp(70)}}
                          className="bg-white p-2 rounded-xl rounded-tr-none">
                          <Text style={{fontSize: wp(4)}}>
                            {message.content}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        {/* recording, clear and stop buttons */}
        {chat ? (
          <View className="flex flex-row mb-[90px] items-center justify-center mr-2">
            {loading ? (
              <Image
                source={LoadingIcon}
                style={{width: hp(10), height: hp(10)}}
              />
            ) : (
              <>
                <View style={styles.textInput}>
                  <TextInput
                    placeholder="Message..."
                    multiline
                    selectionColor={'#059669'}
                    value={result}
                    className="w-[90%]"
                    onChangeText={text => setResult(text)}
                  />
                  {result && (
                    <TouchableOpacity onPress={fetchResponse}>
                      <Image source={SendIcon} className="h-5 w-5" />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setChat(false);
                  }}>
                  <Image
                    source={VoiceIcon}
                    className="h-11 w-11 bg-white rounded-full"
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <View className="flex  mb-[90px] justify-center items-center">
            {loading ? (
              <Image
                source={LoadingIcon}
                style={{width: hp(10), height: hp(10)}}
              />
            ) : recording ? (
              <TouchableOpacity className="space-y-2" onPress={stopRecording}>
                {/* recording stop button */}
                <Image
                  className="rounded-full"
                  source={VoiceLoadingIcon}
                  style={{width: hp(10), height: hp(10)}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={startRecording}>
                {/* recording start button */}
                <Image
                  className="rounded-full bg-white m-2"
                  source={RecordingIcon}
                  style={{width: hp(8), height: hp(8)}}
                />
              </TouchableOpacity>
            )}
            {
              <TouchableOpacity
                className="p-2 absolute right-12"
                onPress={() => {
                  setChat(true);
                }}>
                <Image
                  source={ChatMessageIcon}
                  style={{width: hp(4.5), height: hp(4.5)}}
                />
              </TouchableOpacity>
            }
            {speaking && (
              <TouchableOpacity
                onPress={stopSpeaking}
                className="bg-red-400 rounded-3xl p-2 absolute left-10">
                <Text className="text-white font-semibold">Stop</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  textInput: {
    borderColor: '#059669',
    borderWidth: 1,
    margin: 5,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 12,
    width: '79%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
