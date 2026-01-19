import { Stack } from "expo-router";

export default function MovieLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Daftar Cabang Bioskopi" }} />
      <Stack.Screen name="newlokasi" options={{ title: "Tambahkan Lokasi Baru" }} />
      <Stack.Screen name="[id]/edit" options={{ title: "Edit Movie" }} />
    </Stack>
  );
}