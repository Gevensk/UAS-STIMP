import { Stack } from "expo-router";
import React from "react";

export default function MovieLayout() {
  return (
    <Stack>
      {/* Drawer lives in index.tsx */}
      <Stack.Screen name="index" options={{ title: "Daftar Movie" }} />
      {/* Dynamic detail page */}
      <Stack.Screen name="newmovie" options={{ title: "Tambahkan Movie Baru" }} />
      <Stack.Screen name="[id]/detail" options={{ title: "Movie Detail" }} />
      <Stack.Screen name="[id]/edit" options={{ title: "Edit Movie" }} />
    </Stack>
  );
}