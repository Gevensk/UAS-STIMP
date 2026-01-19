import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Card } from "@rneui/base";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Alert } from "react-native";
import { useAuth } from "../../authContext";

export default function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch(
                "https://ubaya.cloud/react/160422093/bioskopi/login.php",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                }
            );

            const result = await response.json();

            if (result.success) {
                const value = await AsyncStorage.getItem('user');
                if (value) {
                    const user = JSON.parse(value);
                    setUsername(user.username);
                } else {
                    setUsername('');
                    // logout();
                }


                login();
                router.replace("/(app)");
            } else {
                Alert.alert("Login gagal", result.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Tidak dapat terhubung ke server");
        }
    };

    return (
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

            <Button
                title="Submit"
                onPress={handleLogin}
                buttonStyle={styles.button}
            />

        </Card>
    );
}

const
    styles = StyleSheet.create({
        input: {
            height: 40,
            width: 200,
            borderWidth: 1,
            padding: 10,
        },
        viewRow: {
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 50,
            margin: 3,
        },
        button: {
            width: 200,
        }
    });

