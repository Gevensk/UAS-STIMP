import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function OrderLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "grey",
        headerShown: true,

        headerLeft: () => (
          <Pressable
            onPress={() => router.replace("/")}
            style={{ paddingHorizontal: 15 }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="orderlist"
        options={{
          title: "Pesanan Anda",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="orderticket"
        options={{
          title: "Pesan Tiket",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ticket-outline" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="orderfood"
        options={{
          title: "Pesan Makanan",
          tabBarIcon: ({ color }) => (
            <Ionicons name="fast-food-outline" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="[movieid]"
        options={{
          title: "Pesan Tiket",
          tabBarIcon: ({ color }) => (
            <Ionicons name="ticket-outline" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}