import { Stack } from "expo-router";

export default function MovieLayout() {
  return (
    <Stack>
      {/* Drawer lives in index.tsx */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Dynamic detail page */}
      <Stack.Screen name="[id]/detail" options={{ title: "Movie Detail" }} />

      <Stack.Screen name="[id]/edit" options={{ title: "Edit Movie" }} />
    </Stack>
  );
}