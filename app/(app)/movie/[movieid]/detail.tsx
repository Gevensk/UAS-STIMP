// app/(app)/movie/[movieid].tsx
import { Card } from "@rneui/base";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";

export default function DetailMovie() {
    const { movieid } = useLocalSearchParams<{ movieid?: any }>();
    const [movieDetails, setMovieDetails] = useState<any>();


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
                setMovieDetails(resjson.data);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };
        if (movieid) {
            fetchMovieDetails(); // Call fetchMovieDetails
        }
    }, [movieid]);

    return (
        <View>
            {movieDetails ? (
                <Card>
                    <Card.Title>{movieDetails.title}</Card.Title>
                    <Card.Divider />
                    <View style={{ position: "relative", alignItems: "center" }}>
                        <Image
                            style={{ width: "100%", height: 200 }}
                            resizeMode="contain"
                            source={{ uri: movieDetails.url }}
                        />
                        <Text >{movieDetails.overview}</Text>
                        <Text>Genre:</Text>
                        <FlatList
                            data={movieDetails.genres}
                            keyExtractor={(item) => item.genre_name}
                            renderItem={({ item }) => (
                                <View><Text>- {item.genre_name}</Text>
                                </View>)}
                        />

                        <Text>Cast:</Text>
                        <FlatList
                            data={movieDetails.casts}
                            keyExtractor={(item) => item.person_name}
                            renderItem={({ item }) => (
                                <View><Text>- {item.person_name}{item.character_name}</Text>
                                </View>)}
                        />
      <Link
        href={{
          pathname: "/movie/[movieid]/editmovie" ,
         params: { movieid },
        }}
      >
        Edit this movie
      </Link>

                    </View>
                </Card>
            ) : (
                <Text>Loading...</Text>
            )}

        </View>
    );

}
