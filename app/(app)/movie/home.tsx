import { Card } from "@rneui/base";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Home() {
  const [tes, setTes] = useState("waiting");

  const [cari, setCari] = useState("");
  const [movies, setMovies] = useState([]);


   const fetchData = async () => {
    const options = {
       method: 'POST',
       headers: new Headers({
       'Content-Type': 'application/x-www-form-urlencoded'
       }),
        body: "cari="+cari};

      try {
        const response = await fetch("https://ubaya.cloud/react/160422093/movielist.php",options);
        const resjson = await response.json();
        //setTes(resjson?.data?.[2]?.title ?? "no data");
        setMovies(resjson?.data)
      } catch (error) {
        console.log(error);
      }
    };
          

  useEffect(() => {
      fetchData();
    }, []);

    const showData: any=(data:any) => {
    return <FlatList
      data={data}
      keyExtractor={(item) => item.movie_id.toString()}
      renderItem={({item}) => (
        <Card>
        <Card.Title>{item.title}</Card.Title>
        <Card.Divider/>
        <View style={{position:"relative",alignItems:"center"}}>
          <Image
              style={{width:"100%",height:200}}
              resizeMode="contain"
              source={{ uri: item.url }}
            />
          <Text >{item.overview}</Text>
          <Link   href={{ pathname: "/movie/[movieid]/detail", params: { movieid: item.movie_id.toString() } }}>
            Detail
          </Link>
         </View>
        </Card>
           

      )}
      />
    }


  return ( 
    
    <ScrollView >
      <Card>
      <View  style={styles.viewRow} >
          <Text>Cari </Text>
          <TextInput style={styles.input} onChangeText={setCari} 
          onSubmitEditing={fetchData} 
          />
      </View>
      </Card>

      {showData(movies)}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
          input: {
            height: 40,
            width:200,
            borderWidth: 1,
            padding: 10,
          },
          viewRow:{
             flexDirection:"row",
             justifyContent:"flex-end",
             alignItems: 'center',
             paddingRight:50,
             margin:3
          }
       })
