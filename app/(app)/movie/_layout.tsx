import { Stack } from "expo-router";
import React from "react";

export default function MovieLayout() {
  return (
    <Stack>
      {/* Drawer lives in index.tsx */}
      <Stack.Screen name="index" options={{ title: "Daftar Movie" }} />
      {/* Dynamic detail page */}
      <Stack.Screen name="[id]/detail" options={{ title: "Movie Detail" }} />
    </Stack>
  );
}