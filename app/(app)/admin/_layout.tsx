import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function AdminLayout() {
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
          name="handleticket"
          options={{
            title: "Daftar Tiket",
            tabBarIcon: ({ color }) => (
              <Ionicons name="ticket-outline" color={color} size={24} />
            ),
          }}
        />

        <Tabs.Screen
          name="handleorder"
          options={{
            title: "Daftar Pesanan",
            tabBarIcon: ({ color }) => (
              <Ionicons name="fast-food-outline" color={color} size={24} />
            ),
          }}
        />
      </Tabs>
  );
}