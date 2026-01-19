import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "@rneui/base";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Lokasi() {
    const [cari, setCari] = useState("");
    const [lokasi, setLokasi] = useState<any[]>([]);
    const [role, setRole] = useState<string | null>(null);

    const router = useRouter();

    const fetchData = async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "cari=" + cari,
        };

        try {
            const response = await fetch(
                "https://ubaya.cloud/react/160422173/locationlist.php",
                options
            );
            const resjson = await response.json();
            setLokasi(resjson?.data ?? []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getRole = async () => {
            const storedRole = await AsyncStorage.getItem("role");
            setRole(storedRole);
        };
        getRole();
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const showData = (data: any[]) => (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
                <Card containerStyle={styles.card}>
                    <Card.Title style={styles.title}>{item.nama}</Card.Title>
                    <Card.Divider />

                    <View style={styles.centerContent}>
                        <Image
                            source={{ uri: item.url }}
                            style={styles.poster}
                            resizeMode="cover"
                        />

                        <Text style={styles.alamat}>{item.alamat}</Text>
                    </View>

                    {role === "user" && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.pesanButton,
                                pressed && { opacity: 0.8 },
                            ]}
                            onPress={() => {
                                console.log("Pesan di lokasi:", item.nama);
                            }}
                        >
                            <Text style={styles.pesanText}>Pesan Disini</Text>
                        </Pressable>
                    )}
                </Card>
            )}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <Card>
                    <View style={styles.viewRow}>
                        <Text>Cari </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCari}
                            onSubmitEditing={fetchData}
                        />
                    </View>
                </Card>

                {showData(lokasi)}
            </ScrollView>

            {role === "admin" && (
                <Pressable
                    style={({ pressed }) => [
                        styles.fab,
                        pressed && { opacity: 0.8 },
                    ]}
                    onPress={() => router.push("/lokasi/newlokasi")}
                >
                    <Text style={styles.fabIcon}>+</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
    },

    centerContent: {
        alignItems: "center",
    },

    poster: {
        width: "100%",
        height: 250,
        borderRadius: 12,
        marginBottom: 12,
    },

    title: {
        fontSize: 18,
    },

    alamat: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "500",
        color: "#333",
        marginBottom: 16,
    },

    pesanButton: {
        marginTop: 10,
        backgroundColor: "#2563eb",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },

    pesanText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },

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

    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#3f35f8",
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    },

    fabIcon: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 2,
    },
});