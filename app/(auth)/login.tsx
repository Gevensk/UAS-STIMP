import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card } from "@rneui/base";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../authContext";

const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 200,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        height: 40,
        width: 200,
    },
    viewRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: 50,
        margin: 3,
    },
    registerButton: {
        marginTop: 10,
    },
});

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        const options = {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
            }),
            body: "user_id=" + username + "&user_password=" + password,
        };

        const response = await fetch(
            "https://ubaya.cloud/react/160422173/login.php",
            options
        );
        const json = await response.json();

        if (json.result === "success") {
            try {
                await AsyncStorage.setItem("username", json.user_name);
                await AsyncStorage.setItem("role", json.role);
                await AsyncStorage.setItem("saldo", json.saldo);
                await AsyncStorage.setItem("userid", username);
                alert("Login successful");
                login();
                router.replace("/(app)");
            } catch (e) {
                console.error("Error saving data to AsyncStorage", e);
            }
        } else {
            alert("Username or password is incorrect");
        }
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Card>
                <Card.Title>Silakan Login</Card.Title>
                <Card.Divider />

                <View style={styles.viewRow}>
                    <Text>Username </Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={styles.viewRow}>
                    <Text>Password </Text>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <View style={styles.viewRow}>
                    <Button
                        style={styles.button}
                        title="Submit"
                        onPress={handleLogin}
                    />
                </View>

                <View style={styles.viewRow}>
                    <Text style={{ marginTop: 10 }}>Belum punya akun? </Text>
                    
                    <Text
                        style={{ color: "blue", marginTop: 10 }}
                        onPress={() => router.push("/register")}
                    >
                        Daftar di sini
                    </Text>
                </View>
            </Card>
        </View>
    );
}