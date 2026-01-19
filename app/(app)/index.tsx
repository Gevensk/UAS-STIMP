import { useAuth } from '@/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import LogoutButton from '../component/logoutButton';

export default function Index() {
  const [username, setUsername] = useState<string>(''); 
  const { logout } = useAuth(); 
const cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        setUsername(value); 
      } else {
        setUsername('');
        logout();
      }
    } catch (e) {
      console.error('Error reading username from AsyncStorage', e);
      setUsername(''); 
      logout();
    }
  };

  useEffect(() => {
    cekLogin()
  }, []);


  const router = useRouter();


  return (
    
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <Text
            style={{
              color:"red",
              fontSize:24
      }}>Hello {username}</Text>
      
<Button
title="Go to Movie"
onPress={() => router.push('/movie' as Href)} 
/>

<LogoutButton/>

    </View>
  );
}
