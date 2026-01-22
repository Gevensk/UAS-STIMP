import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

// Mendapatkan lebar layar untuk mengatur ukuran grid
const screenWidth = Dimensions.get("window").width;

type Movie = {
  movie_id: number;
  title: string;
  url: string; // Pastikan backend mengirim key 'url' (bukan poster_path)
  status: string;
};

export default function OrderTicket() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cari, setCari] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi Fetch Data
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "cari=" + cari,
      };

      const res = await fetch("https://ubaya.cloud/react/160422173/tiketlist.php", options);
      const data = await res.json();

      if (data.result === "success") {
        // Langsung pakai datanya karena backend sudah memfilter (BARU)
        setMovies(data.data);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.log("Error fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efek untuk memanggil fetchMovies saat komponen pertama kali muncul
  // atau saat kata kunci pencarian berubah
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 500); // Delay 500ms agar tidak nembak API tiap ketik 1 huruf

    return () => clearTimeout(delayDebounceFn);
  }, [cari]);

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.url }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>

        <Pressable
          style={styles.button}
          onPress={() => {
            // Navigasi ke Halaman Detail (Tahap 2)
            router.push({
              pathname: "/order/orderticket/[movieid]", // Sesuai nama file Anda
              params: { movieid: item.movie_id.toString() },
            });
          }}
        >
          <Text style={styles.buttonText}>Pesan Tiket</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header & Search */}
      <View style={styles.header}>
        <Text style={styles.title}>Film Sedang Tayang</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari judul film..."
          value={cari}
          onChangeText={setCari}
        />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#3f35f8" />
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.movie_id.toString()}
          renderItem={renderMovieItem}
          numColumns={2} // Tampilan Grid 2 Kolom
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
              Tidak ada film ditemukan.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa"
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333"
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // Card Styles
  card: {
    width: (screenWidth / 2) - 24, // Agar pas 2 kolom dengan padding
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3, // Shadow Android
    shadowColor: "#000", // Shadow iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: "100%",
    height: 200,
    backgroundColor: "#eee"
  },
  cardContent: {
    padding: 10,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    height: 40,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#3f35f8",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12
  },
});