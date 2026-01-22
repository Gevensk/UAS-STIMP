import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

// Tipe data sesuai output API
type Schedule = {
    schedule_id: number;
    tanggal: string;
    jam_tayang: string;
    harga: number;
    studio_name: string;
    nama_lokasi: string;
};

export default function OrderMovie() {
    // 1. Tangkap movieid dari halaman sebelumnya
    const { movieid } = useLocalSearchParams();

    // State
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    // State untuk menyimpan jadwal yang dipilih user
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
    const [selectedData, setSelectedData] = useState<Schedule | null>(null);

    useEffect(() => {
        fetchSchedules();
    }, [movieid]);

    const fetchSchedules = async () => {
        console.log("=== DEBUG START ===");
        console.log("Movie ID yang mau dikirim:", movieid);

        if (!movieid) {
            Alert.alert("Error", "Movie ID tidak ditemukan (Undefined)");
            return;
        }
        try {
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `movie_id=${movieid}`,
            };

            const res = await fetch("https://ubaya.cloud/react/160422173/detail_jadwal.php", options);
            const data = await res.json();

            if (data.result === "success") {
                setSchedules(data.data);
            } else {
                Alert.alert("Info", "Belum ada jadwal untuk film ini.");
            }
        } catch (error) {
            console.log("Error fetch schedules:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Fungsi Helper: Mengelompokkan Jadwal berdasarkan Lokasi
    // Agar tampilan di UI: Nama Lokasi -> List Jam
    const groupedSchedules = schedules.reduce((acc, curr) => {
        const loc = curr.nama_lokasi;
        if (!acc[loc]) {
            acc[loc] = [];
        }
        acc[loc].push(curr);
        return acc;
    }, {} as Record<string, Schedule[]>);

    // 3. Handle Klik Jam Tayang
    const handleSelectTime = (item: Schedule) => {
        setSelectedScheduleId(item.schedule_id);
        setSelectedData(item); // Simpan data lengkap utk dikirim ke next page
    };

    // 4. Handle Tombol Lanjut (Menuju Pemilihan Kursi)
    const handleNext = () => {
        if (!selectedScheduleId || !selectedData) {
            Alert.alert("Pilih Jadwal", "Silakan pilih lokasi dan jam tayang terlebih dahulu.");
            return;
        }

        // Tahap 3 nanti akan kita buat di sini
        // Sementara kita alert dulu data yang akan dibawa
        Alert.alert("Debug", `Jadwal ID: ${selectedScheduleId} terpilih. Siap pilih kursi.`);

        // NANTI UNCOMMENT INI SAAT TAHAP 3 SIAP:
        router.push({
            pathname: "/order/orderticket/seatselection",
            params: {
                schedule_id: selectedData.schedule_id.toString(),
                studio_name: selectedData.studio_name,
                price: selectedData.harga.toString()
            }
        });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3f35f8" />
                <Text style={{ marginTop: 10 }}>Memuat Jadwal...</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Pilih Jadwal",
                    headerLeft: () => (
                        <Pressable
                            onPress={() => router.replace("/order/orderticket")}
                            style={{ paddingHorizontal: 15 }}
                        >
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </Pressable>
                    ),
                }}
            />
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Pilih Bioskop & Jam</Text>

                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {Object.keys(groupedSchedules).length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>Jadwal Kosong</Text>
                    ) : (
                        // Render Group per Lokasi
                        Object.keys(groupedSchedules).map((locationName) => (
                            <View key={locationName} style={styles.locationSection}>
                                <Text style={styles.locationTitle}>📍 {locationName}</Text>

                                <View style={styles.timeContainer}>
                                    {groupedSchedules[locationName].map((item) => {
                                        const isSelected = selectedScheduleId === item.schedule_id;

                                        return (
                                            <Pressable
                                                key={item.schedule_id}
                                                onPress={() => handleSelectTime(item)}
                                                style={[
                                                    styles.timeButton,
                                                    isSelected && styles.timeButtonSelected
                                                ]}
                                            >
                                                <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                                                    {item.jam_tayang}
                                                </Text>
                                                <Text style={[styles.priceText, isSelected && styles.timeTextSelected]}>
                                                    Rp {item.harga / 1000}k
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Footer Floating Button */}
                <View style={styles.footer}>
                    <View>
                        <Text style={{ fontSize: 12, color: 'gray' }}>Pilihan:</Text>
                        <Text style={{ fontWeight: 'bold' }}>
                            {selectedData ? `${selectedData.nama_lokasi} - ${selectedData.jam_tayang}` : "-"}
                        </Text>
                    </View>
                    <Pressable
                        style={[styles.btnNext, !selectedScheduleId && styles.btnDisabled]}
                        onPress={handleNext}
                        disabled={!selectedScheduleId}
                    >
                        <Text style={styles.btnText}>Pilih Kursi ➝</Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    headerTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#333" },

    // Lokasi Section
    locationSection: { marginBottom: 25 },
    locationTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#444" },

    // Grid Jam Tayang
    timeContainer: { flexDirection: "row", flexWrap: "wrap" },
    timeButton: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        marginBottom: 10,
        alignItems: "center",
        minWidth: 80,
    },
    timeButtonSelected: {
        backgroundColor: "#3f35f8",
        borderColor: "#3f35f8",
    },
    timeText: { fontSize: 16, fontWeight: "bold", color: "#333" },
    timeTextSelected: { color: "white" },
    priceText: { fontSize: 10, color: "gray", marginTop: 2 },

    // Footer
    footer: {
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        backgroundColor: "white",
        padding: 16,
        borderTopWidth: 1, borderColor: "#eee",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 10
    },
    btnNext: {
        backgroundColor: "#3f35f8",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    btnDisabled: { backgroundColor: "#ccc" },
    btnText: { color: "white", fontWeight: "bold" }
});