import { useAuth } from "@/authContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function RootLayout() {

  const { isLoggedIn } = useAuth(); 
if (!isLoggedIn) return <Redirect href="../login" />; 

  return 	<Stack>
    <Stack.Screen name="order" options={{ headerShown: false }} />
    <Stack.Screen name="movie" options={{ headerShown: false }} />
    <Stack.Screen name="lokasi" options={{ headerShown: false }} />
    <Stack.Screen name="topup" options={{ title: "Top Up Saldo" }} />
	</Stack>
;
}
