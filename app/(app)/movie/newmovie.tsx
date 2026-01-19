import React, { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { useValidation } from 'react-simple-form-validator';

export default function NewMovie ()  {
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [runtime, setRuntime] = useState('');
  const [releasedate, setReleasedate] = useState('');
  const [homepage, setHomepage] = useState('');
  const [url, setUrl] = useState('');
  
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
                  "url="+url
          };
            try {
              fetch('https://ubaya.cloud/react/160422173/newmovie.php',
              options)
                .then(response => response.json())
                .then(resjson =>{
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


  return (
    <ScrollView style={styles.container}>
      <Text>Title</Text>
      <TextInput
        style={styles.input}
        onChangeText={setTitle}
        value={title}
      />
      {renderTitleErrors()}
      <Text>Overview</Text>
      <TextInput
        multiline
        numberOfLines={4}
        style={styles.input2}
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
});
