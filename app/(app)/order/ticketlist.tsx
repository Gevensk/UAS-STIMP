import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "@rneui/base";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function TicketList() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const userId = await AsyncStorage.getItem("userid");
      if (!userId) return;

      // Gunakan GET atau POST sesuai kebutuhan API Anda
      const res = await fetch(
        `https://ubaya.cloud/react/160422173/userticket.php?user_id=${userId}`
      );

      const json = await res.json();
      if (json.result === "success") {
        setInvoices(json.data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const renderInvoice = ({ item }: any) => (
    <Card containerStyle={styles.card}>
      {/* Bagian Header: Judul Film */}
      <View style={styles.header}>
        <Text style={styles.movieTitle}>{item.movie_title}</Text>
        <Text style={styles.dateText}>{item.tanggal_beli}</Text>
      </View>

      <View style={styles.divider} />

      {/* Bagian Body: Poster dan Detail */}
      <View style={styles.row}>
        <Image source={{ uri: item.poster_url }} style={styles.poster} />

        <View style={styles.detailContainer}>
          <Text style={styles.label}>Pemesan:</Text>
          <Text style={styles.value}>{item.username}</Text>

          <Text style={[styles.label, { marginTop: 8 }]}>Nomor Kursi:</Text>
          <Text style={styles.seatsValue}>{item.seats}</Text>
        </View>
      </View>

      {/* Bagian Footer: Total Bayar */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Pembayaran</Text>
        <Text style={styles.totalValue}>
          Rp {parseInt(item.total_bayar).toLocaleString("id-ID")}
        </Text>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.invoice_id.toString()}
        renderItem={renderInvoice}
        contentContainerStyle={{ paddingTop: 10 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada riwayat tiket.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
    elevation: 4,
    borderWidth: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  detailContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  seatsValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563eb",
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
    marginTop: 10,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 13,
    color: "#555",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e11d48", // Warna kemerahan untuk harga
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
});