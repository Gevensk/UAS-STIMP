import { useAuth } from "@/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import LogoutButton from "../component/logoutButton";


export default function Index() {
  const [username, setUsername] = useState<string>("");
  const [saldo, setSaldo] = useState(0);
  const { logout } = useAuth();
  const router = useRouter();

  const cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      const saldo = await AsyncStorage.getItem("saldo");
      if (value !== null) {
        setUsername(value);
        const numericSaldo = saldo ? parseInt(saldo, 10) : 0;
        setSaldo(numericSaldo);
        
      } else {
        logout();
      }
    } catch (e) {
      console.error("Error reading username", e);
      logout();
    }
  };

  useEffect(() => {
    cekLogin();
  }, []);

  const formatRupiah = (number:any) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bioskopi App</Text>
      <Text style={styles.subtitle}>Hello, {username} 👋</Text>
      <Text style={styles.subtitle}>Saldo: {formatRupiah(saldo)}</Text>

      <View style={styles.card}>
        <View style={styles.buttonWrapper}>
          <Button
            title="📍 Daftar Lokasi"
            onPress={() => router.push("/lokasi" as Href)}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="🎬 Daftar Movie"
            onPress={() => router.push("/movie" as Href)}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="🎟️ Pesan Tiket / Makanan"
            onPress={() => router.push("/order" as Href)}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="💰 Top Up Saldo"
            onPress={() => router.push("/topup" as Href)}
          />
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <LogoutButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
  },

  buttonWrapper: {
    marginBottom: 12,
  },
});