import { Button } from "@rneui/base";
import { useRouter } from "expo-router";
import React from "react";
import { useAuth } from "../../authContext";
export default function LogoutButton() {
const { logout } = useAuth();
const router = useRouter();
const handleLogout = async () => {
await logout(); // clears AsyncStorage + flips isLoggedIn=false
router.replace("../login"); // go to auth group (avoids web loop)
};
return <Button type="clear" title="Logout" onPress={handleLogout} />;
}
