import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Index() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#fff',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 30,
        },
        label: {
            fontSize: 16,
            marginBottom: 8,
        },
        input: {
            borderWidth: 1,
            borderColor: '#aaa',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            marginBottom: 20,
        },
        button: {
            backgroundColor: '#2075f5ff',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    const handleTopUp = async () => {
        if (!amount || parseInt(amount) <= 0) {
            alert("Masukkan nominal yang valid");
            return;
        }

        try {
            const userId = await AsyncStorage.getItem("userid");

            if (!userId) {
                alert("User belum login");
                return;
            }

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body:
                    "user_id=" + encodeURIComponent(userId) +
                    "&amount=" + encodeURIComponent(amount),
            };

            const response = await fetch(
                "https://ubaya.cloud/react/160422173/topup.php",
                options
            );

            const json = await response.json();

            if (json.result === "success") {
                alert("Top up berhasil 🎉");
                setAmount("");
            } else {
                alert(json.message);
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan koneksi");
        }
    };

    const [amount, setAmount] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Top Up Saldo</Text>

            <Text style={styles.label}>Nominal Top Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Masukkan nominal"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />

            <TouchableOpacity style={styles.button} onPress={handleTopUp}>
                <Text style={styles.buttonText}>Top Up</Text>
            </TouchableOpacity>
        </View>
    );
}