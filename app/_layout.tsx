import { Redirect, Slot, usePathname, useRootNavigationState } from "expo-router";
import { AuthProvider, useAuth } from "../authContext";
export default function Layout() {
    return (
        <AuthProvider>
            <Gate />
        </AuthProvider>
    );
}
function Gate() {
    const { isLoggedIn, isReady } = useAuth();
    const navState = useRootNavigationState();
    const pathname = usePathname();
    if (!isReady || !navState?.key) return <Slot />;
    const inAuthGroup = pathname.startsWith("/(auth)");
    if (!isLoggedIn && !inAuthGroup) {
        return <Redirect href="../login" />;
    }

    if (isLoggedIn && inAuthGroup) {
        return <Redirect href="../index" />;
    }
    return <Slot />;
}