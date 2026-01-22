import { Button, Card } from "@rneui/base";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HandleOrder() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        "https://ubaya.cloud/react/160422173/orderlist.php"
      );
      const json = await res.json();

      if (json.success) {
        setOrders(json.data);
      }
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  const handleSelesai = async (pesananId: number) => {
    try {
      const res = await fetch(
        "https://ubaya.cloud/react/160422173/orderselesai.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pesanan_id: pesananId,
          }),
        }
      );

      const json = await res.json();

      if (json.success) {
        alert("Pesanan Selesai");
        fetchOrders();
      } else {
        alert(json.message ?? "Gagal update status");
      }
    } catch (error) {
      console.log("UPDATE ERROR:", error);
      alert("Terjadi kesalahan");
    }
  };

  const renderOrder = ({ item }: any) => (
    <Card containerStyle={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.lokasi}>{item.nama_lokasi}</Text>
          <Text style={styles.status}>({item.status})</Text>
        </View>

        <Text style={styles.username}>{item.username}</Text>
      </View>

      <Card.Divider />

      {item.items?.map((menu: any, idx: number) => (
        <View key={idx} style={styles.row}>
          <Image source={{ uri: menu.url }} style={styles.image} />

          <View style={{ flex: 1 }}>
            <Text style={styles.nama}>{menu.nama}</Text>
            <Text>
              {menu.jumlah} x Rp {menu.harga}
            </Text>
          </View>

          <Text style={styles.subtotal}>
            Rp {menu.subtotal}
          </Text>
        </View>
      ))}

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.totalLabel}>Total Harga</Text>
          <Text style={styles.totalValue}>
            Rp {item.total_harga}
          </Text>
        </View>

        {item.status !== "selesai" && (
          <Button
            title="Selesai"
            color="success"
            radius={8}
            onPress={() => handleSelesai(item.pesanan_id)}
          />
        )}
      </View>
    </Card>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.pesanan_id.toString()}
      renderItem={renderOrder}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  lokasi: {
    fontSize: 16,
    fontWeight: "bold",
  },

  status: {
    fontSize: 13,
    color: "#666",
  },

  username: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },

  nama: {
    fontWeight: "600",
  },

  subtotal: {
    fontWeight: "bold",
  },

  footerRow: {
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 14,
    color: "#555",
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});