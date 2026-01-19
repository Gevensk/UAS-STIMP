import { useAuth } from "@/authContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function RootLayout() {

  const { isLoggedIn } = useAuth(); 
if (!isLoggedIn) return <Redirect href="../login" />; 

  return 	<Stack>
    <Stack.Screen name="index" options={{ title: "Bioskopi" }} />
    <Stack.Screen name="movie" options={{ headerShown: false }} />
    <Stack.Screen name="topup" options={{ title: "Top Up Saldo" }} />

    #Exercise
      <Stack.Screen
        name="user/[userId]/[postId]"
        options={{ title: "User Post Detail" }}
      />
	</Stack>
;
}
