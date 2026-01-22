import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable, ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function Checkout() {
    const [userId, setUserId] = useState<string | null>(null);
    const params = useLocalSearchParams();

    useEffect(() => {
        const loadData = async () => {
            const userData = await AsyncStorage.getItem("userid");

            if (userData) {
                setUserId(String(userData));
            }
        };

        loadData();
    }, []);

    // Ambil data yang dikirim dari halaman Kursi
    const schedule_id = params.schedule_id as string;
    const studio_name = params.studio_name as string;
    const seats = JSON.parse(params.seats as string); // Parsing JSON string jadi Array
    const total_price = parseInt(params.total_ticket_price as string);

    // Biaya Admin (Ceritanya)
    const adminFee = 5000;
    const grandTotal = total_price + adminFee;

    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        // Validasi agar TS tahu userId pasti ada (bukan null)
        if (!userId) {
            Alert.alert("Error", "User ID tidak ditemukan. Silakan login kembali.");
            return;
        }

        setLoading(true);
        try {
            const form = new FormData();
            form.append("schedule_id", schedule_id);

            // Sekarang TS tidak akan protes karena sudah divalidasi di atas
            form.append("user_id", userId);

            form.append("total_bayar", grandTotal.toString());
            form.append("seats", JSON.stringify(seats));
            // ... sisa kode fetch

            const res = await fetch("https://ubaya.cloud/react/160422173/submit_order.php", {
                method: "POST",
                body: form
            });

            const data = await res.json();

            if (data.result === "success") {
                Alert.alert("Berhasil!", "Tiket berhasil dibeli. Selamat menonton!", [
                    {
                        text: "OK",
                        onPress: () => router.dismissAll() // Kembali ke Home (Reset Stack)
                    }
                ]);
            } else {
                Alert.alert("Gagal", data.message);
            }

        } catch (error) {
            Alert.alert("Error", "Terjadi kesalahan koneksi");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>

                <Text style={styles.title}>Ringkasan Pesanan</Text>

                {/* KARTU STRUK / TIKET */}
                <View style={styles.ticketCard}>

                    {/* Header Struk */}
                    <View style={styles.ticketHeader}>
                        <Text style={styles.movieTitle}>UBAYA CINEPLEX</Text>
                        <Text style={styles.studioName}>{studio_name}</Text>
                    </View>

                    {/* Garis Putus-putus (Dashed Line Manual) */}
                    <View style={styles.dashedLine} />

                    {/* Detail Pesanan */}
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Kursi Dipilih</Text>
                        <Text style={styles.value}>{seats.join(", ")}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Jumlah Tiket</Text>
                        <Text style={styles.value}>{seats.length} x Orang</Text>
                    </View>

                    {/* Rincian Harga */}
                    <View style={[styles.dashedLine, { marginTop: 20 }]} />

                    <View style={styles.priceRow}>
                        <Text style={styles.label}>Subtotal Tiket</Text>
                        <Text style={styles.value}>Rp {total_price.toLocaleString("id-ID")}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.label}>Biaya Layanan</Text>
                        <Text style={styles.value}>Rp {adminFee.toLocaleString("id-ID")}</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Bayar</Text>
                        <Text style={styles.totalValue}>Rp {grandTotal.toLocaleString("id-ID")}</Text>
                    </View>
                </View>

                {/* Metode Pembayaran (UI Only) */}
                <Text style={[styles.title, { marginTop: 30, fontSize: 16 }]}>Metode Pembayaran</Text>
                <View style={styles.paymentMethod}>
                    <View style={styles.radioSelected} />
                    <Text style={{ fontWeight: 'bold' }}>Saldo UbayaPay</Text>
                    <Text style={{ marginLeft: 'auto', color: '#3f35f8' }}>Rp 5.000.000</Text>
                </View>

            </ScrollView>

            {/* Tombol Bayar */}
            <View style={styles.footer}>
                <Pressable
                    style={styles.btnPay}
                    onPress={handlePay}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.btnText}>Bayar Sekarang ➝</Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" }, // Background agak abu
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#333" },

    ticketCard: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 20,
        elevation: 3, // Shadow Android
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, // Shadow iOS
    },
    ticketHeader: { alignItems: "center", marginBottom: 15 },
    movieTitle: { fontSize: 18, fontWeight: "900", color: "#3f35f8", letterSpacing: 1 },
    studioName: { fontSize: 14, color: "gray", marginTop: 2 },

    dashedLine: {
        height: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderStyle: "dashed", // Style garis putus-putus
        marginVertical: 10,
        borderRadius: 1
    },

    detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    priceRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    label: { color: "gray" },
    value: { fontWeight: "600", color: "#333" },

    totalRow: {
        flexDirection: "row", justifyContent: "space-between",
        marginTop: 15, paddingTop: 15,
        borderTopWidth: 1, borderTopColor: "#eee"
    },
    totalLabel: { fontSize: 16, fontWeight: "bold" },
    totalValue: { fontSize: 18, fontWeight: "bold", color: "#3f35f8" },

    paymentMethod: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'white', padding: 15, borderRadius: 10,
        borderWidth: 1, borderColor: '#3f35f8',
        marginTop: 10
    },
    radioSelected: {
        width: 16, height: 16, borderRadius: 8, backgroundColor: '#3f35f8', marginRight: 10
    },

    footer: {
        padding: 20, backgroundColor: "white", borderTopWidth: 1, borderColor: "#eee"
    },
    btnPay: {
        backgroundColor: "#3f35f8", padding: 15, borderRadius: 10, alignItems: "center"
    },
    btnText: { color: "white", fontWeight: "bold", fontSize: 16 }
});