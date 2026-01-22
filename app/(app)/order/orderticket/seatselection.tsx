import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable, ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

// 2. Masukkan kode ini di dalam return(), di bagian atas biar kelihatan
<View style={{ padding: 20, backgroundColor: 'yellow', marginBottom: 20 }}>
    <Text>TESTING AREA (Akan Dihapus Nanti)</Text>

    {/* Tes 1: Link Tanpa Params */}
    <Link href="/order/orderticket/checkout" style={{ fontSize: 20, color: 'red', fontWeight: 'bold' }}>
        KLIK SAYA: Cek Apakah Checkout.tsx Ada?
    </Link>
</View>

export default function SeatSelection() {
    // const router = useRouter();
    const params = useLocalSearchParams();
    const schedule_id = params.schedule_id as string;
    const price = parseInt(params.price as string) || 0;
    const studio_name = params.studio_name as string;

    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // === KONFIGURASI 8x8 (A-H) ===
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8];

    useEffect(() => {
        fetchBookedSeats();
    }, []);

    const fetchBookedSeats = async () => {
        try {
            const form = new FormData();
            form.append("schedule_id", schedule_id);

            const res = await fetch("https://ubaya.cloud/react/160422173/get_booked_seats.php", {
                method: "POST",
                body: form,
            });
            const data = await res.json();

            if (data.result === "success") {
                setBookedSeats(data.data);
            }
        } catch (error) {
            console.log("Error fetch seats:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeatPress = (seatId: string) => {
        if (bookedSeats.includes(seatId)) return;

        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    // Di dalam file seatselection.tsx

    // Tambahkan fungsi helper ini di luar komponen atau di dalam komponen (sebelum handleNext)
    const confirmOrder = () => {
        return new Promise((resolve) => {
            Alert.alert(
                "Konfirmasi Pesanan",
                `Kamu memilih ${selectedSeats.length} kursi.\nTotal: Rp ${(selectedSeats.length * price).toLocaleString("id-ID")}\n\nLanjut ke pembayaran?`,
                [
                    {
                        text: "Batal",
                        style: "cancel",
                        onPress: () => resolve(false), // Jika batal, kembalikan FALSE
                    },
                    {
                        text: "Ya, Lanjut",
                        onPress: () => resolve(true),  // Jika ya, kembalikan TRUE
                    },
                ],
                { cancelable: false }
            );
        });
    };

    // Ubah handleNext menjadi ASYNC
    const handleNext = async () => {
        // 1. Validasi
        if (selectedSeats.length === 0) {
            Alert.alert("Pilih Kursi", "Minimal pilih 1 kursi dong.");
            return;
        }

        // 2. Tampilkan Alert dan TUNGGU (await) sampai user memilih
        const userConfirmed = await confirmOrder();

        // 3. Cek hasil pilihan user
        if (userConfirmed) {
            // 4. Navigasi dijalankan DI SINI (Di luar scope Alert, jadi aman 100%)
            console.log("Navigasi dimulai...");
            router.push({
                pathname: "/order/orderticket/checkout",
                params: {
                    schedule_id: schedule_id,
                    studio_name: studio_name,
                    seats: JSON.stringify(selectedSeats),
                    total_ticket_price: (selectedSeats.length * price).toString(),
                },
            });
        } else {
            console.log("User membatalkan pesanan");
        }
    };
    return (
        <>
            <Stack.Screen
                options={{
                    title: "Pilih Kursi",
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
                <View style={styles.header}>
                    <Text style={styles.studioName}>{studio_name}</Text>
                    <Text style={styles.subTitle}>Layar Bioskop (Depan)</Text>
                    {/* Garis Layar */}
                    <View style={styles.screenLine} />
                </View>
                <ScrollView contentContainerStyle={styles.seatContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#3f35f8" />
                    ) : (
                        rows.map((row) => (
                            <View key={row} style={styles.row}>
                                {cols.map((col) => {
                                    const seatId = `${row}${col}`;
                                    const isBooked = bookedSeats.includes(seatId);
                                    const isSelected = selectedSeats.includes(seatId);

                                    // === LOGIKA LORONG ===
                                    // Jika kolom = 4, beri margin kanan extra (Gap Lorong)
                                    const isGapColumn = col === 4;

                                    return (
                                        <Pressable
                                            key={seatId}
                                            onPress={() => handleSeatPress(seatId)}
                                            disabled={isBooked}
                                            style={[
                                                styles.seat,
                                                isBooked ? styles.seatBooked : styles.seatAvailable,
                                                isSelected && styles.seatSelected,
                                                // INI LOGIKANYA: Tambah jarak di kanan kolom 4
                                                isGapColumn && { marginRight: 25 }
                                            ]}
                                        >
                                            <Text style={[
                                                styles.seatText,
                                                (isSelected || isBooked) && { color: "white" }
                                            ]}>
                                                {seatId}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ))
                    )}
                </ScrollView>

                {/* Legend */}
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[styles.seatSample, styles.seatAvailable]} />
                        <Text style={styles.legendText}>Kosong</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.seatSample, styles.seatSelected]} />
                        <Text style={styles.legendText}>Pilihanmu</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.seatSample, styles.seatBooked]} />
                        <Text style={styles.legendText}>Terisi</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View>
                        <Text style={{ color: "gray", fontSize: 12 }}>Total Harga</Text>
                        <Text style={styles.totalPrice}>
                            Rp {(selectedSeats.length * price).toLocaleString("id-ID")}
                        </Text>
                    </View>
                    {selectedSeats.length > 0 ? (
                        /* KONDISI 1: Jika user SUDAH pilih kursi -> Pakai LINK agar navigasi pasti jalan */
                        <Link
                            href={{
                                pathname: "/order/orderticket/checkout",
                                params: {
                                    schedule_id: schedule_id,
                                    studio_name: studio_name,
                                    // Kita kirim string JSON agar aman
                                    seats: JSON.stringify(selectedSeats),
                                    total_ticket_price: (selectedSeats.length * price).toString(),
                                },
                            }}
                            asChild // PENTING: Agar style tombol di bawah tetap dipakai
                        >
                            <Pressable style={styles.btnCheckout}>
                                <Text style={styles.btnText}>Lanjut Bayar (Rp {(selectedSeats.length * price).toLocaleString("id-ID")}) ➝</Text>
                            </Pressable>
                        </Link>
                    ) : (
                        /* KONDISI 2: Jika BELUM pilih kursi -> Tombol biasa (tanpa Link) yang disabled/abu-abu */
                        <Pressable
                            style={[styles.btnCheckout, styles.btnDisabled]}
                            onPress={() => Alert.alert("Ups", "Pilih minimal 1 kursi dulu ya!")}
                        >
                            <Text style={styles.btnText}>Pilih Kursi Dulu</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: { alignItems: "center", paddingTop: 20, paddingBottom: 10 },
    studioName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    subTitle: { fontSize: 12, color: "gray", marginBottom: 5 },

    // Efek Layar Bioskop Melengkung (Visual Saja)
    screenLine: {
        width: "85%", height: 6, backgroundColor: "#b0c4de",
        borderBottomLeftRadius: 50, borderBottomRightRadius: 50, // Efek lengkung
        marginBottom: 20,
        shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, elevation: 5
    },

    seatContainer: { paddingVertical: 10, alignItems: "center", paddingBottom: 50 },
    row: { flexDirection: "row", marginBottom: 8 },

    seat: {
        width: 34, height: 34,
        marginHorizontal: 3, // Jarak standar antar kursi
        borderRadius: 8,       // Kursi agak bulat (Rounded)
        justifyContent: "center", alignItems: "center",
        borderWidth: 1,
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, elevation: 1
    },

    // Warna-warni
    seatAvailable: { backgroundColor: "white", borderColor: "#ddd" },
    seatBooked: { backgroundColor: "#333", borderColor: "#333" }, // Hitam/Gelap biar jelas laku
    seatSelected: { backgroundColor: "#3f35f8", borderColor: "#3f35f8" },

    seatText: { fontSize: 10, color: "#555", fontWeight: '600' },

    legendContainer: {
        flexDirection: 'row', justifyContent: 'center', marginBottom: 15, gap: 15,
        borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    seatSample: { width: 18, height: 18, borderRadius: 4, borderWidth: 1 },
    legendText: { fontSize: 12, color: '#555' },

    footer: {
        padding: 16, borderTopWidth: 1, borderColor: "#eee",
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        backgroundColor: "white", elevation: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1
    },
    totalPrice: { fontSize: 18, fontWeight: "bold", color: "#3f35f8" },
    btnCheckout: {
        backgroundColor: "#3f35f8", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10
    },
    btnDisabled: { backgroundColor: "#ccc" },
    btnText: { color: "white", fontWeight: "bold" },
});             