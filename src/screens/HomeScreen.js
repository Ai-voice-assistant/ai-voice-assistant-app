import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import SearchIcon from '../../assets/images/search.png';
import axios from 'axios';

const HomeScreen = () => {
  const [newsData, setNewsData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const getNewsDetails = () => {
    setLoading(true);
    axios
      .get(
        'https://newsapi.org/v2/everything?q=artificial intelligence&apiKey=b75c3102f71042efb196125fd2e24e8c',
      )
      .then(res => {
        setNewsData(res?.data?.articles);
        setLoading(false);
      })
      .catch(err => {
        console.log(err, 'news error');
        setLoading(false);
      });
  };

  useEffect(() => {
    getNewsDetails();
  }, []);

  const formatDate = dateString => {
    const dateObject = new Date(dateString);

    const day = dateObject.getUTCDate();
    const month = dateObject.getUTCMonth() + 1;
    const year = dateObject.getUTCFullYear();

    const formattedDate = `${(day < 10 ? '0' : '') + day}/${
      (month < 10 ? '0' : '') + month
    }/${year}`;

    return formattedDate;
  };

  const filterNews = () => {
    const filteredNews = newsData.filter(article =>
      article.title.toLowerCase().includes(search.toLowerCase()),
    );
    return search !== '' ? filteredNews : newsData;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchTextInput}
        placeholder="Search news..."
        selectionColor={'#059669'}
        onChangeText={text => setSearch(text)}
      />
      <Image source={SearchIcon} style={styles.searchIcon} />
      {loading ? (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator color={'#059669'} size={'large'} />
        </SafeAreaView>
      ) : filterNews().length > 0 ? (
        <FlatList
          data={filterNews()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
            item?.urlToImage && (
              <TouchableOpacity
                style={styles.newsContainer}
                onPress={() => {
                  Linking.openURL(item?.url);
                }}>
                <Image source={{uri: item?.urlToImage}} style={styles.image} />
                <View style={styles.detailsContainer}>
                  <Text style={styles.title}>{item?.title}</Text>
                  <Text style={styles.description} numberOfLines={2}>
                    {item?.description}
                  </Text>
                  <Text style={styles.date}>
                    {`Publised on: ${formatDate(item?.publishedAt)}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }
        />
      ) : (
        <Text className="text-center text-gray-700 text-2xl font-semibold mt-4">
          No news found!
        </Text>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#e4fff6', paddingTop: 45},
  loadingContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  image: {
    height: 180,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  searchTextInput: {
    height: 50,
    borderColor: '#059669',
    borderWidth: 1,
    margin: 5,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 12,
  },
  searchIcon: {
    height: 20,
    width: 20,
    position: 'absolute',
    top: 65,
    right: 30,
  },
  newsContainer: {
    borderRadius: 10,
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 6,
  },
  detailsContainer: {padding: 12, gap: 5},
  title: {fontSize: 16, fontWeight: '600'},
  date: {
    color: 'black',
    fontWeight: '500',
    opacity: 0.6,
    fontSize: 13,
  },
  description: {color: 'grey', fontSize: 12},
});
