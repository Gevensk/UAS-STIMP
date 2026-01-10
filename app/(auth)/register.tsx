import { Button, Card } from "@rneui/base";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

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
});

export default function Register() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !name || !password || !confirmPassword) {
            alert("Semua field harus diisi");
            return;
        }

        if (password !== confirmPassword) {
            alert("Password dan ulang password tidak sama");
            return;
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body:
                "user_id=" + encodeURIComponent(username) +
                "&user_name=" + encodeURIComponent(name) +
                "&user_password=" + encodeURIComponent(password),
        };

        try {
            const response = await fetch(
                "https://ubaya.cloud/react/160422173/register.php",
                options
            );
            const json = await response.json();

            if (json.result === "success") {
                alert("Registrasi berhasil, silakan login");
                router.replace("/login");
            } else {
                alert(json.message);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan koneksi");
        }
    };

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Card>
                <Card.Title>Daftarkan Akun Anda</Card.Title>
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
                    <Text>Nama </Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
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
                    <Text>Ulang Password </Text>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <View style={styles.viewRow}>
                    <Button
                        title="Register"
                        onPress={handleRegister}
                        style={styles.button}
                    />
                </View>

                <View style={styles.viewRow}>
                    <Text>Sudah punya akun? </Text>
                    <Text
                        style={{ color: "blue" }}
                        onPress={() => router.replace("/login")}
                    >
                        Login di sini
                    </Text>
                </View>
            </Card>
        </View>
    );
}