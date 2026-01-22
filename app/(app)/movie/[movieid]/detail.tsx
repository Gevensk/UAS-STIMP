import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card } from "@rneui/base";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DetailMovie() {
    const { movieid } = useLocalSearchParams<{ movieid?: string | string[] }>();
    const movieId = Array.isArray(movieid) ? movieid[0] : movieid;
    const [movieDetails, setMovieDetails] = useState<any>(null);
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const getRole = async () => {
        const storedRole = await AsyncStorage.getItem("role");
        setRole(storedRole);
        };
        getRole();
    }, []);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: "id=" + movieid,
            };

            try {
                const response = await fetch(
                    "https://ubaya.cloud/react/160422173/detailmovie.php",
                    options
                );
                const resjson = await response.json();
                setMovieDetails(resjson.data);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };

        if (movieid) fetchMovieDetails();
    }, [movieid]);

    return (
        <>
            <Stack.Screen options={{ title: "Detail Movie" }} />
            <ScrollView>
                {movieDetails ? (
                    <Card>
                        <Card.Title>{movieDetails.title}</Card.Title>
                        <Card.Divider />

                        <Image
                            style={styles.poster}
                            resizeMode="contain"
                            source={{ uri: movieDetails.url }}
                        />

                        <Text style={styles.overview}>
                            {movieDetails.overview}
                        </Text>

                        <View style={styles.infoRow}>
                            <View style={styles.column}>
                                <Text style={styles.sectionTitle}>Genre</Text>
                                {movieDetails.genres.map((item: any) => (
                                    <Text key={item.genre_name}>
                                        • {item.genre_name}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.column}>
                                <Text style={styles.sectionTitle}>Cast</Text>
                                {movieDetails.casts.map((item: any) => (
                                    <Text key={item.person_name}>
                                        • {item.person_name} ({item.character_name})
                                    </Text>
                                ))}
                            </View>
                        </View>
                        
                        {role === "admin" && (
                            <View style={styles.buttonRow}>
                                <Button
                                    title="Edit Movie Ini"
                                    onPress={() => {
                                        if (!movieId) return;

                                        router.push({
                                            pathname: "/movie/[movieid]/editmovie",
                                            params: { movieid: movieId },
                                        });
                                    }}
                                />
                            </View>
                        )}
                    </Card>
                ) : (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>
                        Loading...
                    </Text>
                )}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    poster: {
        width: "100%",
        height: 350,
        marginBottom: 15,
    },

    overview: {
        marginBottom: 20,
        fontSize: 14,
    },

    infoRow: {
        flexDirection: "row",
        marginBottom: 20,
    },

    column: {
        flex: 1,
    },

    sectionTitle: {
        fontWeight: "bold",
        marginBottom: 5,
    },

    buttonRow: {
        alignItems: "flex-end",
        marginTop: 10,
    },
});