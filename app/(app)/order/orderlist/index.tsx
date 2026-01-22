import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "@rneui/base";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function OrderList() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = await AsyncStorage.getItem("userid");
      if (!userId) return;

      const res = await fetch(
        "https://ubaya.cloud/react/160422173/userorder.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: String(userId) }),
        }
      );

      const json = await res.json();
      if (json.success) setOrders(json.data);
    };

    fetchOrders();
  }, []);

  const renderOrder = ({ item }: any) => (
    <Card containerStyle={styles.card}>
      <Text style={styles.lokasi}>{item.nama_lokasi} - ({item.status})</Text>

      {item.items.map((menu: any, idx: number) => (
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

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Harga</Text>
        <Text style={styles.totalValue}>
          Rp {item.total_harga}
        </Text>
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

  lokasi: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
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

  totalRow: {
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
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