import { useAuth } from "@/authContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Redirect href="/login" />; // pastikan path sesuai

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="movie" options={{ headerShown: false }} />
      {/* Hanya tambahkan route jika file ada */}
      {/* <Stack.Screen name="user/[userId]/[postId]" options={{ title: "User Post Detail" }} /> */}
    </Stack>
  );
}

