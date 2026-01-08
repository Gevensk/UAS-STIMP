
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useValidation } from 'react-simple-form-validator';
import RNPickerSelect from 'react-native-picker-select';


export default function EditMovie ()  {
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [runtime, setRuntime] = useState('');
  const [releasedate, setReleasedate] = useState('');
  const [homepage, setHomepage] = useState('');
  const [url, setUrl] = useState('');

  const [genres, setGenres] = useState();
  const { movieid } = useLocalSearchParams<{ movieid?: string | string[] }>();
   const [pilihanGenres, setPilihanGenres] = useState([]);
   const [selectedGenre, setSelectedGenre] = useState('');
  const [triggerRefresh, setTriggerRefresh] = useState(false);

  const { isFieldInError, getErrorsInField, isFormValid } = useValidation({
    fieldsRules: {
      title: { required: true },
      overview: { required: true, minlength:50 },
      runtime:{required: true ,numbers:true},
      releasedate:{ required: true, date:true },
      homepage:{homepage:true}
    },
    state: {title,overview,runtime,releasedate,homepage},
  });

  
  const renderTitleErrors = () => {
    if (isFieldInError('title')) {
      return getErrorsInField('title').map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };

  const renderOverviewErrors = () => {
    if (isFieldInError('overview')) {
      return getErrorsInField('overview').map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };

   const renderRuntimeErrors = () => {
    if (isFieldInError('runtime')) {
      return getErrorsInField('runtime').map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };
  
  const renderReleasedateErrors = () => {
    if (isFieldInError('releasedate')) {
      return getErrorsInField('releasedate').map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };

    const renderHomepageErrors = () => {
    if (isFieldInError('homepage')) {
      return getErrorsInField('homepage').map((errorMessage, index) => (
        <Text key={index} style={styles.errorText}>
          {errorMessage}
        </Text>
      ));
    }
    return null;
  };

   const renderPoster = () => {
    if (url!='') {
      return ( 
      <Image
      style={{width:300,height:400}}
      resizeMode="contain"
      source={{ uri: url }}
    />
      );
      
    }
    return null;
  };

 const renderComboBox = () => {
    return (
      <RNPickerSelect
        onValueChange={(value) => setSelectedGenre(value)}
        items={pilihanGenres}
        placeholder={{ label: "Tambahkan Gnere baru", value: null }}
      />
    );
  };



  const submitData = () => {
          const options = {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: "title="+title+"&"+
                  "homepage="+homepage+"&"+
                  "overview="+overview+"&"+
                  "release_date="+releasedate+"&"+
                  "runtime="+runtime+"&"+
                  "url="+url+"&"+
                  "movie_id="+movieid

          };
            try {
              fetch('https://ubaya.cloud/react/160422093/updatemovie.php',
              options)
                .then(response => response.json())
                .then(async resjson =>{
                  console.log(resjson);


              
                  if(resjson.result==='success') alert('sukses')
                });
            } catch (error) {
              console.log(error);
            } 
          }

 const renderButtonSubmit = () => {
    if (isFormValid) {
      return ( 
        <Button title="Submit" onPress={submitData} />
      );
    }
    return null;
  };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'id=' + movieid,
            };
            try {
                const response = await fetch('https://ubaya.cloud/react/160422093/detailmovie.php', options);
                const resjson = await response.json();

                setTitle(resjson.data.title || '');
                setOverview(resjson.data.overview || '');
                setRuntime(resjson.data.runtime || '');
                setReleasedate(resjson.data.release_date || '');
                setHomepage(resjson.data.homepage || '');
                setUrl(resjson.data.url || '');
                setGenres(resjson.data.genres)
                const response2 = await fetch('https://ubaya.cloud/react/160422093/genrelist.php', options);
                const resjson2 = await response2.json();
                setPilihanGenres(resjson2.data);

            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };
        if (movieid) {
            fetchMovieDetails(); // Call fetchMovieDetails
        }
    }, [movieid,triggerRefresh]);



    useEffect(() => {
    const addMovieGenre = async () => {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'movie_id='+movieid+"&"+
        "genre_id="+selectedGenre
      };
      try {
        const response = await fetch('https://ubaya.cloud/react/160422093/addmoviegenre.php', options);
        response.json()
        .then(async resjson =>{
            console.log(resjson);
            if(resjson.result==='success') alert('sukses')
            setTriggerRefresh(prev => !prev); 
          });
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };

    if (selectedGenre) {
        addMovieGenre(); // Call fetchMovieDetails
    }
  }, [selectedGenre]);


  return (
    <ScrollView style={styles.container}>
      <Text>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
      />
      {renderTitleErrors()}
      <Text>Overview</Text>
      <TextInput
        multiline
        numberOfLines={4}
        style={styles.input2}
        value={overview}
        onChangeText={setOverview} />
      {renderOverviewErrors()}

      <Text>Runtime</Text>
      <TextInput
        
        style={styles.input}
        onChangeText={setRuntime}
        value={runtime} />
        {renderRuntimeErrors()}

      <Text>Release Date</Text>
      <TextInput
        
        style={styles.input}
        onChangeText={setReleasedate}
        value={releasedate} />
        {renderReleasedateErrors()}
     <Text>Homepage</Text>
      <TextInput
        
        style={styles.input}
        onChangeText={setHomepage}
        value={homepage} />
        {renderHomepageErrors()}

      <Text>Poster</Text>
      <TextInput
        
        style={styles.input}
        onChangeText={setUrl}
        value={url} />
        {renderPoster()}

        {renderButtonSubmit()}

        <Text>Genre:</Text>
        <FlatList 
        data={genres} 
        keyExtractor={(item) => item.genre_name} 
        renderItem={({item}) => (
        <View><Text>{item.genre_name}</Text>
        </View>)}
        />
        {renderComboBox()}
    </ScrollView>

    
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor :'#fff',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  input2: {
    height: 140,
    borderColor: '#ccc',
    backgroundColor :'#fff',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },

  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#fff',
  },
  result: {
    marginTop: 16,
    fontSize: 16,
  },
});
