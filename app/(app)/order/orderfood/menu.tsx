import { useCart } from "@/app/context/CartContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
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
import { ScrollView } from "react-native-gesture-handler";

export default function Menu() {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("all");
  const [foods, setFoods] = useState<any[]>([]);

  const [qty, setQty] = useState<Record<number, number>>({});
  const { addToCart, cart } = useCart();

  const fetchData = async () => {
    const body =
      "cari=" +
      encodeURIComponent(cari) +
      "&kategori=" +
      encodeURIComponent(kategori);

    try {
      const response = await fetch(
        "https://ubaya.cloud/react/160422173/foodlist.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        }
      );
      const resjson = await response.json();
      setFoods(resjson?.data ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [kategori]);

  const updateQty = (id: number, delta: number) => {
    setQty((prev) => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (item: any) => {
    const jumlah = qty[item.id] ?? 0;
    if (jumlah === 0) return;

    addToCart({
      id: item.id,
      nama: item.nama,
      harga: item.harga,
      url: item.url,
      qty: jumlah,
    });

    setQty((prev) => ({ ...prev, [item.id]: 0 }));
  };

  const totalCart = cart.reduce((sum, item) => sum + item.qty, 0);

  const renderItem = ({ item }: any) => (
    <Card containerStyle={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: item.url }} style={styles.poster} />

        <View style={styles.middleContent}>
          <Text style={styles.nama}>{item.nama}</Text>
          <Text style={styles.deskripsi} numberOfLines={4}>
            {item.deskripsi}
          </Text>
          <Text style={styles.nama}>Rp {item.harga}</Text>
        </View>

        <View style={styles.rightAction}>
          <View style={styles.qtyRow}>
            <Pressable
              style={styles.qtyButton}
              onPress={() => updateQty(item.id, -1)}
            >
              <Text style={styles.qtyText}>-</Text>
            </Pressable>

            <Text style={styles.qtyValue}>{qty[item.id] ?? 0}</Text>

            <Pressable
              style={styles.qtyButton}
              onPress={() => updateQty(item.id, 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addText}>Tambah</Text>
          </Pressable>
        </View>
      </View>
    </Card>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Daftar Menu",
          headerLeft: () => (
            <Pressable
              onPress={() => router.replace("/order/orderfood")}
              style={{ paddingHorizontal: 15 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
          ),
        }}
      />

      <ScrollView>
        <Card>
          <View style={styles.searchRow}>
            <TextInput
              placeholder="Cari menu"
              style={styles.searchInput}
              value={cari}
              onChangeText={setCari}
              onSubmitEditing={fetchData}
            />

            <Picker
              selectedValue={kategori}
              style={styles.picker}
              onValueChange={setKategori}
            >
              <Picker.Item label="Semua" value="all" />
              <Picker.Item label="Main Course" value="main course" />
              <Picker.Item label="Appetizer" value="appetizer" />
              <Picker.Item label="Dessert" value="dessert" />
              <Picker.Item label="Coffee" value="coffee" />
              <Picker.Item label="Non-Coffee" value="non-coffee" />
              <Picker.Item label="Alcohol Drinks" value="alcohol drinks" />
            </Picker>
          </View>
        </Card>

        <FlatList
          data={foods}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/order/orderfood/keranjang")}
      >
        <Ionicons name="cart" size={26} color="white" />

        {totalCart > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalCart}</Text>
          </View>
        )}
      </Pressable>
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

  poster: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },

  nama: {
    fontSize: 16,
    fontWeight: "bold",
  },

  deskripsi: {
    fontSize: 13,
    color: "#555",
  },

  bottomRight: {
    position: "absolute",
    right: 12,
    bottom: 12,
    alignItems: "flex-end",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  qtyButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#2585eb",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  qtyValue: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

  addButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },

  addText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  searchInput: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
  },

  picker: {
    width: 170,
    height: 40,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  middleContent: {
    flex: 1,
    paddingRight: 10,
  },

  rightAction: {
    justifyContent: "space-between",
    alignItems: "center",
  },
});