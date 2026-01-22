import { useCart } from "@/app/context/CartContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "@rneui/base";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Keranjang() {
  const { cart, updateNote, removeItem, clearCart } = useCart();
  const [userId, setUserId] = useState<string | null>(null);
  const [userSaldo, setUserSaldo] = useState<number | null>(null);
  const [lokasiId, setLokasiId] = useState<number | null>(null);

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.harga * item.qty,
    0
  );

  useEffect(() => {
    const loadData = async () => {
      const userData = await AsyncStorage.getItem("userid");
      const lokasiData = await AsyncStorage.getItem("selected_lokasi");
      const saldo = await AsyncStorage.getItem("saldo");

      if (userData) {
        setUserId(String(userData));
      }

      if (lokasiData) {
        setLokasiId(Number(lokasiData));
      }

      if (saldo) {
        setUserSaldo(Number(saldo));
      }
    };

    loadData();
  }, []);

  const submitOrder = async () => {
    if (!userId || !lokasiId) {
      alert("User atau lokasi belum dipilih");
      return;
    }

    if (userSaldo === null) {
      alert("Saldo tidak ditemukan");
      return;
    }

    if (grandTotal > userSaldo) {
      alert("Saldo anda tidak cukup. Silahkan Topup");
      return;
    }

    try {
      const payload = {
        user_id: userId,
        lokasi_id: lokasiId,
        total_harga: grandTotal,
        items: cart.map(item => ({
          food_id: item.id,
          jumlah: item.qty,
          note: item.note ?? ""
        }))
      };

      const res = await fetch(
        "https://ubaya.cloud/react/160422173/orderfood.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (json.success) {
        alert("Pesanan berhasil dibuat");
        clearCart();
        router.push("/order/orderlist")
      } else {
        alert(json.message ?? "Gagal membuat pesanan");
      }
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan");
    }
  };


  const renderItem = ({ item }: any) => {
    const subtotal = item.harga * item.qty;

    return (
      <Card containerStyle={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: item.url }} style={styles.image} />

          <View style={styles.content}>
            <Text style={styles.nama}>{item.nama}</Text>
            <Text style={styles.detail}>
              {item.qty} x Rp {item.harga}
            </Text>
            <Text style={styles.subtotal}>Subtotal: Rp {subtotal}</Text>

            <View style={styles.noteRow}>
              <TextInput
                placeholder="Catatan (opsional)"
                value={item.note}
                onChangeText={(text) => updateNote(item.id, text)}
                style={styles.noteInput}
              />

              <Pressable
                style={styles.deleteButton}
                onPress={() => removeItem(item.id)}
              >
                <Ionicons name="trash-outline" size={18} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Keranjang Anda",
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/order/orderfood/menu")}
              style={{ paddingHorizontal: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 140 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Keranjang masih kosong</Text>
        }
      />

      <View style={styles.footer}>
        <View>
          <Text style={styles.saldoLabel}>Saldo Anda</Text>
          <Text
            style={[
              styles.saldoValue,
              userSaldo !== null && userSaldo < grandTotal && { color: "#ef4444" },
            ]}
          >
            Rp {userSaldo ?? 0}
          </Text>

          <View style={{ height: 6 }} />

          <Text style={styles.totalLabel}>Grand Total</Text>
          <Text style={styles.totalValue}>Rp {grandTotal}</Text>
        </View>

        <Pressable
          style={[
            styles.orderButton,
            cart.length === 0 && { opacity: 0.5 },
            userSaldo !== null && grandTotal > userSaldo && { backgroundColor: "#9ca3af" },
          ]}
          disabled={cart.length === 0 || (userSaldo !== null && grandTotal > userSaldo)}
          onPress={submitOrder}
        >
          <Text style={styles.orderText}>Pesan</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },

  row: {
    flexDirection: "row",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  nama: {
    fontSize: 16,
    fontWeight: "bold",
  },

  detail: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },

  subtotal: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },

  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    fontSize: 13,
  },

  deleteButton: {
    marginLeft: 10,
    backgroundColor: "#ef4444",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  totalLabel: {
    fontSize: 14,
    color: "#555",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },

  orderButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
  },

  orderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },

  saldoLabel: {
    fontSize: 13,
    color: "#555",
  },

  saldoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },
});