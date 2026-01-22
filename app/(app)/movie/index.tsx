import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "@rneui/base";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Home() {
  const [cari, setCari] = useState("");
  const [movies, setMovies] = useState([]);
  const [role, setRole] = useState<string | null>(null);

  const fetchData = async () => {
    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: "cari=" + cari
    };

    try {
      const response = await fetch("https://ubaya.cloud/react/160422173/movielist.php", options);
      const resjson = await response.json();
      setMovies(resjson?.data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getRole = async () => {
      const storedRole = await AsyncStorage.getItem("role");
      setRole(storedRole);
    };
    getRole();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const showData: any = (data: any) => {
    return <FlatList
      data={data}
      keyExtractor={(item) => item.movie_id.toString()}
      contentContainerStyle={{ paddingBottom: 100 }}
      renderItem={({ item }) => (
        <Card>
          <Card.Title>{item.title}</Card.Title>

          {/* Status */}
          <Text style={[styles.status,
          item.status === "Coming Soon" ? styles.comingSoon : styles.nowShowing]}>
            {item.status}
          </Text>
          <Card.Divider />

          <View style={styles.row}>
            <Image
              source={{ uri: item.url }}
              style={styles.poster}
              resizeMode="cover"
            />

            <View style={styles.content}>
              <Text numberOfLines={6} style={styles.overview}>
                {item.overview}
              </Text>

              <View style={styles.buttonWrapper}>
                <Link
                  href={{
                    pathname: "/movie/[movieid]/detail",
                    params: { movieid: item.movie_id.toString() },
                  }}
                  style={styles.button}
                >
                  Detail
                </Link>

                {role === "admin" && (
                  <Link
                    href={{
                      pathname: "/movie/[movieid]/editmovie",
                      params: { movieid: item.movie_id.toString() },
                    }}
                    style={[styles.button, styles.editButton]}
                  >
                    Edit
                  </Link>
                )}
              </View>
            </View>
          </View>
        </Card>
      )}
    />
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Card>
          <View style={styles.viewRow} >
            <Text>Cari </Text>
            <TextInput style={styles.input} onChangeText={setCari}
              onSubmitEditing={fetchData}
            />
          </View>
        </Card>

        {showData(movies)}
      </ScrollView>

      {role === "admin" && (
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push("/movie/newmovie")}
        >
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 6,
  },

  comingSoon: {
    color: "#f59e0b", // kuning / oranye
  },

  nowShowing: {
    color: "#22c55e", // hijau
  },

  row: {
    flexDirection: "row",
  },

  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },

  content: {
    flex: 1,
    position: "relative",
    paddingBottom: 50,
  },

  overview: {
    fontSize: 14,
  },

  buttonWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    gap: 8,
  },

  button: {
    backgroundColor: "#2075f5",
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    overflow: "hidden",
    fontSize: 14,
  },

  editButton: {
    backgroundColor: "#f59e0b",
  },

  input: {
    height: 40,
    width: 200,
    borderWidth: 1,
    padding: 10,
  },

  viewRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'center',
    paddingRight: 50,
    margin: 3
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3f35f8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  fabIcon: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 2,
  },
});